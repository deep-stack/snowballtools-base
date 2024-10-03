import debug from 'debug';
import { DataSource } from 'typeorm';
import path from 'path';

import { Registry, Util } from '@cerc-io/registry-sdk';

import { getConfig } from '../src/utils';
import { Deployment, DeploymentStatus, Environment } from '../src/entity/Deployment';

const log = debug('snowball:publish-deploy-records');

async function main() {
  const { registryConfig, database, misc } = await getConfig();

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
      status: DeploymentStatus.Building
    }
  });

  for await (const deployment of deployments) {
    const url = `https://${deployment.project.name}-${deployment.id}.${misc.projectDomain}`;

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

    const fee = Util.parseGasAndFees(registryConfig.fee.gas, registryConfig.fee.fees);

    const result = await registry.setRecord(
      {
        privateKey: registryConfig.privateKey,
        record: applicationDeploymentRecord,
        bondId: registryConfig.bondId
      },
      '',
      fee
    );

    // Remove deployment for project subdomain if deployment is for production environment
    if (deployment.environment === Environment.Production) {
      applicationDeploymentRecord.url = `https://${deployment.project.subDomain}`

      await registry.setRecord(
        {
          privateKey: registryConfig.privateKey,
          record: applicationDeploymentRecord,
          bondId: registryConfig.bondId
        },
        '',
        fee
      );
    }

    log('Application deployment record data:', applicationDeploymentRecord);
    log(`Application deployment record published: ${result.id}`);
  }
}

main().catch((err) => {
  log(err);
});
