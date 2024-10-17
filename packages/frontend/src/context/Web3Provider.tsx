import React, { ReactNode, Suspense } from 'react';
import { SiweMessage, generateNonce } from 'siwe';
import { WagmiProvider } from 'wagmi';
import { arbitrum, mainnet } from 'wagmi/chains';
import axios from 'axios';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { createSIWEConfig } from '@web3modal/siwe';
import type {
  SIWECreateMessageArgs,
  SIWEVerifyMessageArgs,
} from '@web3modal/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// TODO: Use environment variable
const WALLET_CONNECT_ID="d37f5a2f09d22f5e3ccaff4bbc93d37c"
const queryClient = new QueryClient();
const axiosInstance = axios.create({
  // TODO: Use environment variable
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
  withCredentials: true,
});
const metadata = {
  name: 'Web3Modal',
  description: 'Snowball Web3Modal',
  url: window.location.origin,
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};
const chains = [mainnet, arbitrum] as const;
const config = defaultWagmiConfig({
  chains,
  projectId: WALLET_CONNECT_ID,
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
    return generateNonce()
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
  projectId: WALLET_CONNECT_ID,
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