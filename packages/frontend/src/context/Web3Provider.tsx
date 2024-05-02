import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

if (!import.meta.env.VITE_WALLET_CONNECT_ID) {
  throw new Error('Error: REACT_APP_WALLET_CONNECT_ID env config is not set');
}

export default function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
