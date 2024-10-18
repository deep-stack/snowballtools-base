import { SiweMessage } from 'siwe';
import { PKPEthersWallet } from '@lit-protocol/pkp-ethers';
import { v4 as uuid } from 'uuid';

import { BASE_URL } from './constants';

const domain = window.location.host;
const origin = window.location.origin;

export async function signInWithEthereum(
  chainId: number,
  action: 'signup' | 'login',
  wallet: PKPEthersWallet,
) {
  const message = await createSiweMessage(
    chainId,
    await wallet.getAddress(),
    'Sign in with Ethereum to the app.',
  );
  const signature = await wallet.signMessage(message);

  const res = await fetch(`${BASE_URL}/auth/validate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action, message, signature }),
    credentials: 'include',
  });
  return (await res.json()) as { success: boolean; error?: string };
}

async function createSiweMessage(
  chainId: number,
  address: string,
  statement: string,
) {
  const message = new SiweMessage({
    domain,
    address,
    statement,
    uri: origin,
    version: '1',
    chainId,
    nonce: uuid().replace(/[^a-z0-9]/g, ''),
  });
  return message.prepareMessage();
}
