import debug from 'debug';

import { Registry, Util } from '@cerc-io/registry-sdk';

import { getConfig } from '../src/utils';

const log = debug('snowball:initialize-registry');

const DENOM = 'alnt';
const BOND_AMOUNT = '1000000000';

async function main () {
  const { registryConfig } = await getConfig();

  // TODO: Get authority names from args
  const authorityNames = ['snowballtools', registryConfig.authority];

  const registry = new Registry(registryConfig.gqlEndpoint, registryConfig.restEndpoint, {chainId: registryConfig.chainId});

  const bondId = await registry.getNextBondId(registryConfig.privateKey);
  log('bondId:', bondId);

  const fee = Util.parseGasAndFees(registryConfig.fee.gas, registryConfig.fee.fees);

  await registry.createBond(
    { denom: DENOM, amount: BOND_AMOUNT },
    registryConfig.privateKey,
    fee
  );

  for await (const name of authorityNames) {
    await registry.reserveAuthority({ name }, registryConfig.privateKey, fee);
    log('Reserved authority name:', name);
    await registry.setAuthorityBond(
      { name, bondId },
      registryConfig.privateKey,
      fee
    );
    log(`Bond ${bondId} set for authority ${name}`);
  }
}

main().catch((err) => {
  log(err);
});
