import { ReactNode } from 'react';
import assert from 'assert';
import { SiweMessage, generateNonce } from 'siwe';
import { WagmiProvider } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import axios from 'axios';

import { createWeb3Modal } from '@web3modal/wagmi/react';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { createSIWEConfig } from '@web3modal/siwe';
import type {
  SIWECreateMessageArgs,
  SIWEVerifyMessageArgs,
} from '@web3modal/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { VITE_WALLET_CONNECT_ID, BASE_URL } from 'utils/constants';

if (!VITE_WALLET_CONNECT_ID) {
  throw new Error('Error: REACT_APP_WALLET_CONNECT_ID env config is not set');
}
assert(BASE_URL, 'VITE_SERVER_URL is not set in env');

const queryClient = new QueryClient();
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
  withCredentials: true,
});
const metadata = {
  name: 'Deploy App Auth',
  description: '',
  url: window.location.origin,
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};
const chains = [mainnet] as const;
const config = defaultWagmiConfig({
  chains,
  projectId: VITE_WALLET_CONNECT_ID,
  metadata,
});
const siweConfig = createSIWEConfig({
  createMessage: ({ nonce, address, chainId }: SIWECreateMessageArgs) =>
    new SiweMessage({
      version: '1',
      domain: window.location.host,
      uri: window.location.origin,
      address,
      chainId,
      nonce,
      // Human-readable ASCII assertion that the user will sign, and it must not contain `\n`.
      statement: 'Sign in With Ethereum.',
    }).prepareMessage(),
  getNonce: async () => {
    return generateNonce();
  },
  getSession: async () => {
    try {
      const session = (await axiosInstance.get('/auth/session')).data;
      const { address, chainId } = session;
      return { address, chainId };
    } catch (err) {
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      throw new Error('Failed to get session!');
    }
  },
  verifyMessage: async ({ message, signature }: SIWEVerifyMessageArgs) => {
    try {
      const { success } = (
        await axiosInstance.post('/auth/validate', {
          message,
          signature,
        })
      ).data;
      return success;
    } catch (error) {
      return false;
    }
  },
  signOut: async () => {
    try {
      const { success } = (await axiosInstance.post('/auth/logout')).data;
      return success;
    } catch (error) {
      return false;
    }
  },
  onSignOut: () => {
    window.location.href = '/login';
  },
  onSignIn: () => {
    window.location.href = '/';
  },
});

createWeb3Modal({
  siweConfig,
  wagmiConfig: config,
  projectId: VITE_WALLET_CONNECT_ID,
});
export default function Web3ModalProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
