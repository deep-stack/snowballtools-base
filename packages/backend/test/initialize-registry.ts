import debug from 'debug';

import { Registry } from '@cerc-io/laconic-sdk';

import { DEFAULT_CONFIG_FILE_PATH } from '../src/constants';
import { Config } from '../src/config';
import { getConfig } from '../src/utils';

const log = debug('snowball:initialize-registry');

const DENOM = 'aphoton';
const BOND_AMOUNT = '1000000000';

async function main () {
  const { registryConfig } = await getConfig<Config>(DEFAULT_CONFIG_FILE_PATH);

  // TODO: Get authority names from args
  const authorityNames = ['snowballtools', registryConfig.authority];

  const registry = new Registry(registryConfig.gqlEndpoint, registryConfig.restEndpoint, registryConfig.chainId);

  const bondId = await registry.getNextBondId(registryConfig.privateKey);
  log('bondId:', bondId);
  await registry.createBond(
    { denom: DENOM, amount: BOND_AMOUNT },
    registryConfig.privateKey,
    registryConfig.fee
  );

  for await (const name of authorityNames) {
    await registry.reserveAuthority({ name }, registryConfig.privateKey, registryConfig.fee);
    log('Reserved authority name:', name);
    await registry.setAuthorityBond(
      { name, bondId },
      registryConfig.privateKey,
      registryConfig.fee
    );
    log(`Bond ${bondId} set for authority ${name}`);
  }
}

main().catch((err) => {
  log(err);
});
