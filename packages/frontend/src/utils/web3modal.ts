import { WalletConnectModal } from '@walletconnect/modal';
import { VITE_WALLET_CONNECT_ID } from 'utils/constants';

export const walletConnectModal = new WalletConnectModal({
  projectId: VITE_WALLET_CONNECT_ID!,
  chains:['cosmos:theta-testnet-001', 'cosmos:laconic_9000-1'],
});