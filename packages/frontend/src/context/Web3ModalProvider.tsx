import { ReactNode } from 'react';
import { SiweMessage } from 'siwe';
import { WagmiProvider } from 'wagmi';
import { arbitrum, mainnet } from 'wagmi/chains';
import axios from 'axios';

import { createWeb3Modal } from '@web3modal/wagmi/react';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { createSIWEConfig } from '@web3modal/siwe';
import type {
  SIWECreateMessageArgs,
  SIWEVerifyMessageArgs,
} from '@web3modal/siwe';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
  withCredentials: true,
});

const metadata = {
  name: 'Snowball Tools',
  description: 'Snowball Tools Dashboard',
  url: window.location.origin,
  icons: [
    'https://raw.githubusercontent.com/snowball-tools/mediakit/main/assets/logo.svg',
  ],
};

const chains = [mainnet, arbitrum] as const;
const config = defaultWagmiConfig({
  chains,
  projectId: import.meta.env.VITE_WALLET_CONNECT_ID,
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
    const nonce = (await axiosInstance.get('/auth/nonce')).data;
    if (!nonce) {
      throw new Error('Failed to get nonce!');
    }

    return nonce;
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

if (!import.meta.env.VITE_WALLET_CONNECT_ID) {
  throw new Error('Error: REACT_APP_WALLET_CONNECT_ID env config is not set');
}

createWeb3Modal({
  siweConfig,
  wagmiConfig: config,
  projectId: import.meta.env.VITE_WALLET_CONNECT_ID,
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
