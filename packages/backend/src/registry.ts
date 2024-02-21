import debug from 'debug';
import assert from 'assert';
import { inc as semverInc } from 'semver';
import { DateTime } from 'luxon';

import { Registry as LaconicRegistry } from '@cerc-io/laconic-sdk';

import { RegistryConfig } from './config';
import { ApplicationDeploymentRequest } from './entity/Project';
import { ApplicationRecord, Deployment } from './entity/Deployment';
import { AppDeploymentRecord, PackageJSON } from './types';

const log = debug('snowball:registry');

const APP_RECORD_TYPE = 'ApplicationRecord';
const APP_DEPLOYMENT_REQUEST_TYPE = 'ApplicationDeploymentRequest';
const APP_DEPLOYMENT_RECORD_TYPE = 'ApplicationDeploymentRecord';

// TODO: Move registry code to laconic-sdk/watcher-ts
export class Registry {
  private registry: LaconicRegistry;
  private registryConfig: RegistryConfig;

  constructor (registryConfig : RegistryConfig) {
    this.registryConfig = registryConfig;
    this.registry = new LaconicRegistry(registryConfig.gqlEndpoint, registryConfig.restEndpoint, registryConfig.chainId);
  }

  async createApplicationRecord ({
    packageJSON,
    commitHash,
    appType,
    repoUrl
  }: {
    packageJSON: PackageJSON
    commitHash: string,
    appType: string,
    repoUrl: string
  }): Promise<{applicationRecordId: string, applicationRecordData: ApplicationRecord}> {
    assert(packageJSON.name, "name field doesn't exist in package.json");
    // Use laconic-sdk to publish record
    // Reference: https://git.vdb.to/cerc-io/test-progressive-web-app/src/branch/main/scripts/publish-app-record.sh
    // Fetch previous records
    const records = await this.registry.queryRecords({
      type: APP_RECORD_TYPE,
      name: packageJSON.name
    }, true);

    // Get next version of record
    const bondRecords = records.filter((record: any) => record.bondId === this.registryConfig.bondId);
    const [latestBondRecord] = bondRecords.sort((a: any, b: any) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());
    const nextVersion = semverInc(latestBondRecord?.attributes.version ?? '0.0.0', 'patch');

    assert(nextVersion, 'Application record version not valid');

    // Create record of type ApplicationRecord and publish
    const applicationRecord = {
      type: APP_RECORD_TYPE,
      version: nextVersion,
      repository_ref: commitHash,
      repository: [repoUrl],
      app_type: appType,
      name: packageJSON.name,
      ...(packageJSON.description && { description: packageJSON.description }),
      ...(packageJSON.homepage && { homepage: packageJSON.homepage }),
      ...(packageJSON.license && { license: packageJSON.license }),
      ...(packageJSON.author && { author: typeof packageJSON.author === 'object' ? JSON.stringify(packageJSON.author) : packageJSON.author }),
      ...(packageJSON.version && { app_version: packageJSON.version })
    };

    const result = await this.registry.setRecord(
      {
        privateKey: this.registryConfig.privateKey,
        record: applicationRecord,
        bondId: this.registryConfig.bondId
      },
      '',
      this.registryConfig.fee
    );

    log('Application record data:', applicationRecord);

    // TODO: Discuss computation of CRN
    const crn = this.getCrn(packageJSON.name);
    log(`Setting name: ${crn} for record ID: ${result.data.id}`);

    await this.registry.setName({ cid: result.data.id, crn }, this.registryConfig.privateKey, this.registryConfig.fee);
    await this.registry.setName({ cid: result.data.id, crn: `${crn}@${applicationRecord.app_version}` }, this.registryConfig.privateKey, this.registryConfig.fee);
    await this.registry.setName({ cid: result.data.id, crn: `${crn}@${applicationRecord.repository_ref}` }, this.registryConfig.privateKey, this.registryConfig.fee);

    return { applicationRecordId: result.data.id, applicationRecordData: applicationRecord };
  }

  async createApplicationDeploymentRequest (data: {
    appName: string,
    commitHash: string,
    repository: string,
    environmentVariables: { [key: string]: string }
  }): Promise<{
    applicationDeploymentRequestId: string,
    applicationDeploymentRequestData: ApplicationDeploymentRequest
  }> {
    const crn = this.getCrn(data.appName);
    const records = await this.registry.resolveNames([crn]);
    const applicationRecord = records[0];

    if (!applicationRecord) {
      throw new Error(`No record found for ${crn}`);
    }

    // Create record of type ApplicationDeploymentRequest and publish
    const applicationDeploymentRequest = {
      type: APP_DEPLOYMENT_REQUEST_TYPE,
      version: '1.0.0',
      name: `${applicationRecord.attributes.name}@${applicationRecord.attributes.app_version}`,
      application: `${crn}@${applicationRecord.attributes.app_version}`,

      // TODO: Not set in test-progressive-web-app CI
      // dns: '$CERC_REGISTRY_DEPLOYMENT_SHORT_HOSTNAME',
      // deployment: '$CERC_REGISTRY_DEPLOYMENT_CRN',

      // https://git.vdb.to/cerc-io/laconic-registry-cli/commit/129019105dfb93bebcea02fde0ed64d0f8e5983b
      config: JSON.stringify({
        env: data.environmentVariables
      }),
      meta: JSON.stringify({
        note: `Added by Snowball @ ${DateTime.utc().toFormat('EEE LLL dd HH:mm:ss \'UTC\' yyyy')}`,
        repository: data.repository,
        repository_ref: data.commitHash
      })
    };

    const result = await this.registry.setRecord(
      {
        privateKey: this.registryConfig.privateKey,
        record: applicationDeploymentRequest,
        bondId: this.registryConfig.bondId
      },
      '',
      this.registryConfig.fee
    );
    log(`Application deployment request record published: ${result.data.id}`);
    log('Application deployment request data:', applicationDeploymentRequest);

    return { applicationDeploymentRequestId: result.data.id, applicationDeploymentRequestData: applicationDeploymentRequest };
  }

  /**
   * Fetch ApplicationDeploymentRecords for deployments
   */
  async getDeploymentRecords (deployments: Deployment[]): Promise<AppDeploymentRecord[]> {
    // Fetch ApplicationDeploymentRecords for corresponding ApplicationRecord set in deployments
    // TODO: Implement Laconicd GQL query to filter records by multiple values for an attribute
    const records = await this.registry.queryRecords({
      type: APP_DEPLOYMENT_RECORD_TYPE
    }, true);

    // Filter records with ApplicationRecord ids
    return records.filter((record: AppDeploymentRecord) => deployments.some(deployment => deployment.applicationRecordId === record.attributes.application));
  }

  getCrn (packageJsonName: string): string {
    const [arg1, arg2] = packageJsonName.split('/');

    if (arg2) {
      const authority = arg1.replace('@', '');
      return `crn://${authority}/applications/${arg2}`;
    }

    return `crn://${arg1}/applications/${arg1}`;
  }
}
