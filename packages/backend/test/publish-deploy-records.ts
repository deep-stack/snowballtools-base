import debug from 'debug';
import { DataSource } from 'typeorm';
import path from 'path';

import { Registry } from '@snowballtools/laconic-sdk';

import { Config } from '../src/config';
import { DEFAULT_CONFIG_FILE_PATH } from '../src/constants';
import { getConfig } from '../src/utils';
import { Deployment, DeploymentStatus } from '../src/entity/Deployment';

const log = debug('snowball:publish-deploy-records');

async function main () {
  const { registryConfig, database, misc } = await getConfig<Config>(DEFAULT_CONFIG_FILE_PATH);

  const registry = new Registry(
    registryConfig.gqlEndpoint,
    registryConfig.restEndpoint,
    registryConfig.chainId
  );

  const dataSource = new DataSource({
    type: 'better-sqlite3',
    database: database.dbPath,
    synchronize: true,
    entities: [path.join(__dirname, '../src/entity/*')]
  });

  await dataSource.initialize();

  const deploymentRepository = dataSource.getRepository(Deployment);
  const deployments = await deploymentRepository.find({
    relations: {
      project: true
    },
    where: {
      status: DeploymentStatus.Building
    }
  });

  for await (const deployment of deployments) {
    const url = `${deployment.project.name}-${deployment.id}.${misc.projectDomain}`;

    const applicationDeploymentRecord = {
      type: 'ApplicationDeploymentRecord',
      version: '0.0.1',
      name: deployment.applicationRecordData.name,
      application: deployment.applicationRecordId,

      // TODO: Create DNS record
      dns: 'bafyreihlymqggsgqiqawvehkpr2imt4l3u6q7um7xzjrux5rhsvwnuyewm',

      // Using dummy values
      meta: JSON.stringify({
        config: 'da39a3ee5e6b4b0d3255bfef95601890afd80709',
        so: '66fcfa49a1664d4cb4ce4f72c1c0e151'
      }),

      request: deployment.applicationDeploymentRequestId,
      url
    };

    const result = await registry.setRecord(
      {
        privateKey: registryConfig.privateKey,
        record: applicationDeploymentRecord,
        bondId: registryConfig.bondId
      },
      '',
      registryConfig.fee
    );

    log('Application deployment record data:', applicationDeploymentRecord);
    log(`Application deployment record published: ${result.data.id}`);
  }
}

main().catch((err) => {
  log(err);
});
