import { ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';
import { arbitrum, mainnet } from 'wagmi/chains';

import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

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

if (!import.meta.env.VITE_WALLET_CONNECT_ID) {
  throw new Error('Error: REACT_APP_WALLET_CONNECT_ID env config is not set');
}

export default function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
