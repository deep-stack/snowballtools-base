import debug from 'debug';
import assert from 'assert';
import { inc as semverInc } from 'semver';
import { DateTime } from 'luxon';

import { Registry as LaconicRegistry } from '@cerc-io/registry-sdk';

import { RegistryConfig } from './config';
import {
  ApplicationRecord,
  Deployment,
  ApplicationDeploymentRequest,
  ApplicationDeploymentRemovalRequest
} from './entity/Deployment';
import { AppDeploymentRecord, AppDeploymentRemovalRecord, PackageJSON } from './types';
import { parseGasAndFees, sleep } from './utils';

const log = debug('snowball:registry');

const APP_RECORD_TYPE = 'ApplicationRecord';
const APP_DEPLOYMENT_REQUEST_TYPE = 'ApplicationDeploymentRequest';
const APP_DEPLOYMENT_REMOVAL_REQUEST_TYPE = 'ApplicationDeploymentRemovalRequest';
const APP_DEPLOYMENT_RECORD_TYPE = 'ApplicationDeploymentRecord';
const APP_DEPLOYMENT_REMOVAL_RECORD_TYPE = 'ApplicationDeploymentRemovalRecord';
const SLEEP_DURATION = 1000;

// TODO: Move registry code to registry-sdk/watcher-ts
export class Registry {
  private registry: LaconicRegistry;
  private registryConfig: RegistryConfig;

  constructor (registryConfig: RegistryConfig) {
    this.registryConfig = registryConfig;
    this.registry = new LaconicRegistry(
      registryConfig.gqlEndpoint,
      registryConfig.restEndpoint,
      { chainId: registryConfig.chainId }
    );
  }

  async createApplicationRecord ({
    appName,
    packageJSON,
    commitHash,
    appType,
    repoUrl
  }: {
    appName: string;
    packageJSON: PackageJSON;
    commitHash: string;
    appType: string;
    repoUrl: string;
  }): Promise<{
    applicationRecordId: string;
    applicationRecordData: ApplicationRecord;
  }> {
    // Use registry-sdk to publish record
    // Reference: https://git.vdb.to/cerc-io/test-progressive-web-app/src/branch/main/scripts/publish-app-record.sh
    // Fetch previous records
    const records = await this.registry.queryRecords(
      {
        type: APP_RECORD_TYPE,
        name: packageJSON.name
      },
      true
    );

    // Get next version of record
    const bondRecords = records.filter(
      (record: any) => record.bondId === this.registryConfig.bondId
    );
    const [latestBondRecord] = bondRecords.sort(
      (a: any, b: any) =>
        new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
    );
    const nextVersion = semverInc(
      latestBondRecord?.attributes.version ?? '0.0.0',
      'patch'
    );

    assert(nextVersion, 'Application record version not valid');

    // Create record of type ApplicationRecord and publish
    const applicationRecord = {
      type: APP_RECORD_TYPE,
      version: nextVersion,
      repository_ref: commitHash,
      repository: [repoUrl],
      app_type: appType,
      name: appName,
      ...(packageJSON.description && { description: packageJSON.description }),
      ...(packageJSON.homepage && { homepage: packageJSON.homepage }),
      ...(packageJSON.license && { license: packageJSON.license }),
      ...(packageJSON.author && {
        author:
          typeof packageJSON.author === 'object'
            ? JSON.stringify(packageJSON.author)
            : packageJSON.author
      }),
      ...(packageJSON.version && { app_version: packageJSON.version })
    };

    const fee = parseGasAndFees(this.registryConfig.fee.gas, this.registryConfig.fee.fees);

    const result = await this.registry.setRecord(
      {
        privateKey: this.registryConfig.privateKey,
        record: applicationRecord,
        bondId: this.registryConfig.bondId
      },
      this.registryConfig.privateKey,
      fee
    );

    log('Application record data:', applicationRecord);

    // TODO: Discuss computation of LRN
    const lrn = this.getLrn(appName);
    log(`Setting name: ${lrn} for record ID: ${result.id}`);

    await sleep(SLEEP_DURATION);
    await this.registry.setName(
      { cid: result.id, lrn },
      this.registryConfig.privateKey,
      fee
    );

    await sleep(SLEEP_DURATION);
    await this.registry.setName(
      { cid: result.id, lrn: `${lrn}@${applicationRecord.app_version}` },
      this.registryConfig.privateKey,
      fee
    );

    await sleep(SLEEP_DURATION);
    await this.registry.setName(
      {
        cid: result.id,
        lrn: `${lrn}@${applicationRecord.repository_ref}`
      },
      this.registryConfig.privateKey,
      fee
    );

    return {
      applicationRecordId: result.id,
      applicationRecordData: applicationRecord
    };
  }

  async createApplicationDeploymentRequest (data: {
    deployment: Deployment,
    appName: string,
    repository: string,
    environmentVariables: { [key: string]: string },
    dns: string,
  }): Promise<{
    applicationDeploymentRequestId: string;
    applicationDeploymentRequestData: ApplicationDeploymentRequest;
  }> {
    const lrn = this.getLrn(data.appName);
    const records = await this.registry.resolveNames([lrn]);
    const applicationRecord = records[0];

    if (!applicationRecord) {
      throw new Error(`No record found for ${lrn}`);
    }

    // Create record of type ApplicationDeploymentRequest and publish
    const applicationDeploymentRequest = {
      type: APP_DEPLOYMENT_REQUEST_TYPE,
      version: '1.0.0',
      name: `${applicationRecord.attributes.name}@${applicationRecord.attributes.app_version}`,
      application: `${lrn}@${applicationRecord.attributes.app_version}`,
      dns: data.dns,

      // TODO: Not set in test-progressive-web-app CI
      // deployment: '$CERC_REGISTRY_DEPLOYMENT_LRN',

      // https://git.vdb.to/cerc-io/laconic-registry-cli/commit/129019105dfb93bebcea02fde0ed64d0f8e5983b
      config: JSON.stringify({
        env: data.environmentVariables
      }),
      meta: JSON.stringify({
        note: `Added by Snowball @ ${DateTime.utc().toFormat(
          "EEE LLL dd HH:mm:ss 'UTC' yyyy"
        )}`,
        repository: data.repository,
        repository_ref: data.deployment.commitHash
      })
    };

    await sleep(SLEEP_DURATION);

    const fee = parseGasAndFees(this.registryConfig.fee.gas, this.registryConfig.fee.fees);

    const result = await this.registry.setRecord(
      {
        privateKey: this.registryConfig.privateKey,
        record: applicationDeploymentRequest,
        bondId: this.registryConfig.bondId
      },
      this.registryConfig.privateKey,
      fee
    );
    log(`Application deployment request record published: ${result.id}`);
    log('Application deployment request data:', applicationDeploymentRequest);

    return {
      applicationDeploymentRequestId: result.id,
      applicationDeploymentRequestData: applicationDeploymentRequest
    };
  }

  /**
   * Fetch ApplicationDeploymentRecords for deployments
   */
  async getDeploymentRecords (
    deployments: Deployment[]
  ): Promise<AppDeploymentRecord[]> {
    // Fetch ApplicationDeploymentRecords for corresponding ApplicationRecord set in deployments
    // TODO: Implement Laconicd GQL query to filter records by multiple values for an attribute
    const records = await this.registry.queryRecords(
      {
        type: APP_DEPLOYMENT_RECORD_TYPE
      },
      true
    );

    // Filter records with ApplicationRecord ID and Deployment specific URL
    return records.filter((record: AppDeploymentRecord) =>
      deployments.some(
        (deployment) =>
          deployment.applicationRecordId === record.attributes.application &&
          record.attributes.url.includes(deployment.id)
      )
    );
  }

  /**
   * Fetch ApplicationDeploymentRecords by filter
   */
  async getDeploymentRecordsByFilter (filter: { [key: string]: any }): Promise<AppDeploymentRecord[]> {
    return this.registry.queryRecords(
      {
        type: APP_DEPLOYMENT_RECORD_TYPE,
        ...filter
      },
      true
    );
  }

  /**
   * Fetch ApplicationDeploymentRemovalRecords for deployments
   */
  async getDeploymentRemovalRecords (
    deployments: Deployment[]
  ): Promise<AppDeploymentRemovalRecord[]> {
    // Fetch ApplicationDeploymentRemovalRecords for corresponding ApplicationDeploymentRecord set in deployments
    const records = await this.registry.queryRecords(
      {
        type: APP_DEPLOYMENT_REMOVAL_RECORD_TYPE
      },
      true
    );

    // Filter records with ApplicationDeploymentRecord and ApplicationDeploymentRemovalRequest IDs
    return records.filter((record: AppDeploymentRemovalRecord) =>
      deployments.some(
        (deployment) =>
          deployment.applicationDeploymentRemovalRequestId === record.attributes.request &&
          deployment.applicationDeploymentRecordId === record.attributes.deployment
      )
    );
  }

  async createApplicationDeploymentRemovalRequest (data: {
    deploymentId: string;
  }): Promise<{
    applicationDeploymentRemovalRequestId: string;
    applicationDeploymentRemovalRequestData: ApplicationDeploymentRemovalRequest;
  }> {
    const applicationDeploymentRemovalRequest = {
      type: APP_DEPLOYMENT_REMOVAL_REQUEST_TYPE,
      version: '1.0.0',
      deployment: data.deploymentId
    };

    const fee = parseGasAndFees(this.registryConfig.fee.gas, this.registryConfig.fee.fees);

    const result = await this.registry.setRecord(
      {
        privateKey: this.registryConfig.privateKey,
        record: applicationDeploymentRemovalRequest,
        bondId: this.registryConfig.bondId
      },
      this.registryConfig.privateKey,
      fee
    );

    log(`Application deployment removal request record published: ${result.id}`);
    log('Application deployment removal request data:', applicationDeploymentRemovalRequest);

    return {
      applicationDeploymentRemovalRequestId: result.id,
      applicationDeploymentRemovalRequestData: applicationDeploymentRemovalRequest
    };
  }

  getLrn(appName: string): string {
    assert(this.registryConfig.authority, "Authority doesn't exist");
    return `lrn://${this.registryConfig.authority}/applications/${appName}`;
  }
}
