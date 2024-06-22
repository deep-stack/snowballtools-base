import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { VITE_WALLET_CONNECT_ID } from 'utils/constants';

const queryClient = new QueryClient();

if (!VITE_WALLET_CONNECT_ID) {
  throw new Error('Error: REACT_APP_WALLET_CONNECT_ID env config is not set');
}

export default function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
