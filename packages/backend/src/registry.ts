import assert from 'assert';
import debug from 'debug';
import { DateTime } from 'luxon';
import { Octokit } from 'octokit';
import { inc as semverInc } from 'semver';
import { DeepPartial } from 'typeorm';

import { Registry as LaconicRegistry, getGasPrice, parseGasAndFees } from '@cerc-io/registry-sdk';

import { RegistryConfig } from './config';
import {
  ApplicationRecord,
  Deployment,
  ApplicationDeploymentRequest,
  ApplicationDeploymentRemovalRequest
} from './entity/Deployment';
import { AppDeploymentRecord, AppDeploymentRemovalRecord, AuctionParams } from './types';
import { getConfig, getRepoDetails, sleep } from './utils';

const log = debug('snowball:registry');

const APP_RECORD_TYPE = 'ApplicationRecord';
const APP_DEPLOYMENT_AUCTION_RECORD_TYPE = 'ApplicationDeploymentAuction';
const APP_DEPLOYMENT_REQUEST_TYPE = 'ApplicationDeploymentRequest';
const APP_DEPLOYMENT_REMOVAL_REQUEST_TYPE = 'ApplicationDeploymentRemovalRequest';
const APP_DEPLOYMENT_RECORD_TYPE = 'ApplicationDeploymentRecord';
const APP_DEPLOYMENT_REMOVAL_RECORD_TYPE = 'ApplicationDeploymentRemovalRecord';
const SLEEP_DURATION = 1000;

// TODO: Move registry code to registry-sdk/watcher-ts
export class Registry {
  private registry: LaconicRegistry;
  private registryConfig: RegistryConfig;

  constructor(registryConfig: RegistryConfig) {
    this.registryConfig = registryConfig;

    const gasPrice = getGasPrice(registryConfig.fee.gasPrice);

    this.registry = new LaconicRegistry(
      registryConfig.gqlEndpoint,
      registryConfig.restEndpoint,
      { chainId: registryConfig.chainId, gasPrice }
    );
  }

  async createApplicationRecord({
    octokit,
    repository,
    commitHash,
    appType,
  }: {
    octokit: Octokit
    repository: string;
    commitHash: string;
    appType: string;
  }): Promise<{
    applicationRecordId: string;
    applicationRecordData: ApplicationRecord;
  }> {
    const { repo, repoUrl, packageJSON } = await getRepoDetails(octokit, repository, commitHash)
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
      name: repo,
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

    log(`Published application record ${result.id}`);
    log('Application record data:', applicationRecord);

    // TODO: Discuss computation of LRN
    const lrn = this.getLrn(repo);
    log(`Setting name: ${lrn} for record ID: ${result.id}`);

    await sleep(SLEEP_DURATION);
    await this.registry.setName(
      {
        cid: result.id,
        lrn
      },
      this.registryConfig.privateKey,
      fee
    );

    await sleep(SLEEP_DURATION);
    await this.registry.setName(
      {
        cid: result.id,
        lrn: `${lrn}@${applicationRecord.app_version}`
      },
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

  async createApplicationDeploymentAuction(
    appName: string,
    octokit: Octokit,
    auctionParams: AuctionParams,
    data: DeepPartial<Deployment>,
  ): Promise<{
    applicationDeploymentAuctionId: string;
  }> {
    assert(data.project?.repository, 'Project repository not found');

    await this.createApplicationRecord({
      octokit,
      repository: data.project.repository,
      appType: data.project!.template!,
      commitHash: data.commitHash!,
    });

    const lrn = this.getLrn(appName);
    const config = await getConfig();
    const auctionConfig = config.auction;

    const fee = parseGasAndFees(this.registryConfig.fee.gas, this.registryConfig.fee.fees);
    const auctionResult = await this.registry.createProviderAuction(
      {
        commitFee: auctionConfig.commitFee,
        commitsDuration: auctionConfig.commitsDuration,
        revealFee: auctionConfig.revealFee,
        revealsDuration: auctionConfig.revealsDuration,
        denom: auctionConfig.denom,
        maxPrice: auctionParams.maxPrice,
        numProviders: auctionParams.numProviders,
      },
      this.registryConfig.privateKey,
      fee
    )

    if (!auctionResult.auction) {
      throw new Error('Error creating auction');
    }

    // Create record of type applicationDeploymentAuction and publish
    const applicationDeploymentAuction = {
      application: lrn,
      auction: auctionResult.auction.id,
      type: APP_DEPLOYMENT_AUCTION_RECORD_TYPE,
    };

    const result = await this.registry.setRecord(
      {
        privateKey: this.registryConfig.privateKey,
        record: applicationDeploymentAuction,
        bondId: this.registryConfig.bondId
      },
      this.registryConfig.privateKey,
      fee
    );

    log(`Application deployment auction created: ${auctionResult.auction.id}`);
    log(`Application deployment auction record published: ${result.id}`);
    log('Application deployment auction data:', applicationDeploymentAuction);

    return {
      applicationDeploymentAuctionId: auctionResult.auction.id,
    };
  }

  async createApplicationDeploymentRequest(data: {
    deployment: Deployment,
    appName: string,
    repository: string,
    auctionId?: string,
    lrn: string,
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
      }),
      deployer: data.lrn,
      ...(data.auctionId && { auction: data.auctionId }),
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

  async getAuctionWinningDeployers(
    auctionId: string
  ): Promise<string[]> {
    const records = await this.registry.getAuctionsByIds([auctionId]);
    const auctionResult = records[0];

    let deployerLrns = [];
    const { winnerAddresses } = auctionResult;

    for (const auctionWinner of winnerAddresses) {
      const deployerRecords = await this.registry.queryRecords(
        {
          paymentAddress: auctionWinner,
        },
        true
      );

      for (const record of deployerRecords) {
        if (record.names && record.names.length > 0) {
          deployerLrns.push(record.names[0]);
          break;
        }
      }
    }

    return deployerLrns;
  }

  /**
   * Fetch ApplicationDeploymentRecords for deployments
   */
  async getDeploymentRecords(
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

    // Filter records with ApplicationDeploymentRequestId ID and Deployment specific URL
    return records.filter((record: AppDeploymentRecord) =>
      deployments.some(
        (deployment) =>
          deployment.applicationDeploymentRequestId === record.attributes.request &&
          record.attributes.url.includes(deployment.id)
      )
    );
  }

  /**
   * Fetch ApplicationDeploymentRecords by filter
   */
  async getDeploymentRecordsByFilter(filter: { [key: string]: any }): Promise<AppDeploymentRecord[]> {
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
  async getDeploymentRemovalRecords(
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

  async createApplicationDeploymentRemovalRequest(data: {
    deploymentId: string;
    deployerLrn: string;
  }): Promise<{
    applicationDeploymentRemovalRequestId: string;
    applicationDeploymentRemovalRequestData: ApplicationDeploymentRemovalRequest;
  }> {
    const applicationDeploymentRemovalRequest = {
      type: APP_DEPLOYMENT_REMOVAL_REQUEST_TYPE,
      version: '1.0.0',
      deployment: data.deploymentId,
      deployer: data.deployerLrn
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

  async getCompletedAuctionIds(auctionIds: (string | null | undefined)[]): Promise<string[] | null> {
    const validAuctionIds = auctionIds.filter((id): id is string => id !== null && id !== undefined);

    if (!validAuctionIds.length) {
      return null;
    }

    const auctions = await this.registry.getAuctionsByIds(validAuctionIds);

    const completedAuctions = auctions
      .filter((auction: { id:  string, status: string }) => auction.status === 'completed')
      .map((auction: { id:  string, status: string }) => auction.id);

    return completedAuctions;
  }

  async getRecordsByName(name: string): Promise<any> {
    return this.registry.resolveNames([name]);
  }

  async getAuctionData(auctionId: string): Promise<any> {
    return this.registry.getAuctionsByIds([auctionId]);
  }

  getLrn(appName: string): string {
    assert(this.registryConfig.authority, "Authority doesn't exist");
    return `lrn://${this.registryConfig.authority}/applications/${appName}`;
  }
}
