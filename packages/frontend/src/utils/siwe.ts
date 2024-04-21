import { SiweMessage } from 'siwe';
import { PKPEthersWallet } from '@lit-protocol/pkp-ethers';
import { v4 as uuid } from 'uuid';

const domain = window.location.host;
const origin = window.location.origin;

export async function signInWithEthereum(wallet: PKPEthersWallet) {
  const message = await createSiweMessage(
    await wallet.getAddress(),
    'Sign in with Ethereum to the app.',
  );
  const signature = await wallet.signMessage(message);

  const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/validate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, signature }),
    credentials: 'include',
  });
  console.log(await res.text());
}

async function createSiweMessage(address: string, statement: string) {
  const message = new SiweMessage({
    domain,
    address,
    statement,
    uri: origin,
    version: '1',
    chainId: 1,
    nonce: uuid().replace(/[^a-z0-9]/g, ''),
  });
  return message.prepareMessage();
}
