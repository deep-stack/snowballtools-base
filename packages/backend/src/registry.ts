import debug from 'debug';
import { inc as semverInc } from 'semver';

import { Registry as LaconicRegistry } from '@cerc-io/laconic-sdk';

import { RegistryConfig } from './config';
import { ApplicationDeploymentRequest } from './entity/Project';
import { ApplicationRecord } from './entity/Deployment';

const log = debug('snowball:registry');

const APP_RECORD_TYPE = 'ApplicationRecord';
const DEPLOYMENT_RECORD_TYPE = 'ApplicationDeploymentRequest';
const AUTHORITY_NAME = 'snowball';

export class Registry {
  private registry: LaconicRegistry;
  private registryConfig: RegistryConfig;

  constructor (registryConfig : RegistryConfig) {
    this.registryConfig = registryConfig;
    this.registry = new LaconicRegistry(registryConfig.gqlEndpoint, registryConfig.restEndpoint, registryConfig.chainId);
  }

  async createApplicationRecord (data: { recordName: string, appType: string }): Promise<{recordId: string, recordData: ApplicationRecord}> {
    // TODO: Get record name from repo package.json name
    const recordName = data.recordName;

    // Use laconic-sdk to publish record
    // Reference: https://git.vdb.to/cerc-io/test-progressive-web-app/src/branch/main/scripts/publish-app-record.sh
    // Fetch previous records
    const records = await this.registry.queryRecords({
      type: APP_RECORD_TYPE,
      name: recordName
    }, true);

    // Get next version of record
    const bondRecords = records.filter((record: any) => record.bondId === this.registryConfig.bondId);
    const [latestBondRecord] = bondRecords.sort((a: any, b: any) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());
    const nextVersion = semverInc(latestBondRecord?.attributes.version ?? '0.0.0', 'patch');

    // Create record of type ApplicationRecord and publish
    const applicationRecord = {
      type: APP_RECORD_TYPE,
      version: nextVersion ?? '',
      name: recordName,

      // TODO: Get data from repo package.json
      description: '',
      homepage: '',
      license: '',
      author: '',
      repository: '',
      app_version: '0.1.0',

      // TODO: Get latest commit hash from repo production branch / deployment
      repository_ref: '10ac6678e8372a05ad5bb1c34c34',
      app_type: data.appType
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

    // TODO: Discuss computation of crn
    const crn = this.getCrn(data.recordName);

    await this.registry.setName({ cid: result.data.id, crn }, this.registryConfig.privateKey, this.registryConfig.fee);
    await this.registry.setName({ cid: result.data.id, crn: `${crn}@${applicationRecord.app_version}` }, this.registryConfig.privateKey, this.registryConfig.fee);
    await this.registry.setName({ cid: result.data.id, crn: `${crn}@${applicationRecord.repository_ref}` }, this.registryConfig.privateKey, this.registryConfig.fee);

    return { recordId: result.data.id, recordData: applicationRecord };
  }

  async createApplicationDeploymentRequest (data: { appName: string }): Promise<{recordId: string, recordData: ApplicationDeploymentRequest}> {
    const crn = this.getCrn(data.appName);
    const records = await this.registry.resolveNames([crn]);
    const applicationRecord = records[0];

    if (!applicationRecord) {
      throw new Error(`No record found for ${crn}`);
    }

    // Create record of type ApplicationDeploymentRequest and publish
    const applicationDeploymentRequest = {
      type: DEPLOYMENT_RECORD_TYPE,
      version: '1.0.0',
      name: `${applicationRecord.attributes.name}@${applicationRecord.attributes.app_version}`,
      application: `${crn}@${applicationRecord.attributes.app_version}`,

      // TODO: Not set in test-progressive-web-app CI
      // dns: '$CERC_REGISTRY_DEPLOYMENT_SHORT_HOSTNAME',
      // deployment: '$CERC_REGISTRY_DEPLOYMENT_CRN',

      config: {
        env: {
          CERC_WEBAPP_DEBUG: `${applicationRecord.attributes.app_version}`
        }
      },
      meta: {
        note: `Added by Snowball @ ${(new Date()).toISOString()}`,
        repository: applicationRecord.attributes.repository,
        repository_ref: applicationRecord.attributes.repository_ref
      }
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

    return { recordId: result.data.id, recordData: applicationDeploymentRequest };
  }

  getCrn (appName: string): string {
    return `crn://${AUTHORITY_NAME}/applications/${appName}`;
  }
}
