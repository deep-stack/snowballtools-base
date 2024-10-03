import debug from 'debug';
import { DataSource } from 'typeorm';
import path from 'path';

import { Registry } from '@cerc-io/registry-sdk';
import { Util } from '@cerc-io/registry-sdk/src/util';

import { getConfig } from '../src/utils';
import { Deployment, DeploymentStatus } from '../src/entity/Deployment';

const log = debug('snowball:publish-deployment-removal-records');

async function main () {
  const { registryConfig, database } = await getConfig();

  const registry = new Registry(
    registryConfig.gqlEndpoint,
    registryConfig.restEndpoint,
    { chainId: registryConfig.chainId }
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
      status: DeploymentStatus.Deleting
    }
  });

  for await (const deployment of deployments) {
    const applicationDeploymentRemovalRecord = {
      type: "ApplicationDeploymentRemovalRecord",
      version: "1.0.0",
      deployment: deployment.applicationDeploymentRecordId,
      request: deployment.applicationDeploymentRemovalRequestId,
    }

    const fee = Util.parseGasAndFees(registryConfig.fee.gas, registryConfig.fee.fees);

    const result = await registry.setRecord(
      {
        privateKey: registryConfig.privateKey,
        record: applicationDeploymentRemovalRecord,
        bondId: registryConfig.bondId
      },
      '',
      fee
    );

    log('Application deployment removal record data:', applicationDeploymentRemovalRecord);
    log(`Application deployment removal record published: ${result.id}`);
  }
}

main().catch((err) => {
  log(err);
});
