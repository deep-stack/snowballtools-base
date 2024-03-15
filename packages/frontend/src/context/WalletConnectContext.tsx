import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from 'react';

import SignClient from '@walletconnect/sign-client'
import { WalletConnectModal } from "@walletconnect/modal";


// TODO: Get from env
const PROJECT_ID = "c97365bf9f06d12a7488de36240b0ff4"

interface ContextValue {
  connect: ()=> Promise<void>;
}

const walletConnectContext = createContext<ContextValue>({
  connect: async()=> {}
})

const web3Modal = new WalletConnectModal({
  projectId: PROJECT_ID,
  chains: ['eip155:1']
})

export const WalletConnectProvider = ({ children }: { children: ReactNode }) => {
  const [signClient, setSignClient] = useState<SignClient>()

  const createClient = async ()=> {

    const signClient = await SignClient.init({
      projectId: PROJECT_ID,
      // optional parameters
      // relayUrl: '<YOUR RELAY URL>',
      metadata: {
        name: 'Example Dapp',
        description: 'Example Dapp',
        url: '#',
        icons: ['https://walletconnect.com/walletconnect-logo.png']
      }
    })

    setSignClient(signClient)
  }

  const connect = async () => {
    if (!signClient) {
      throw Error("SignClient does not exist");
    }

    const proposalNamespace = {
      eip155: {
          methods: [
            'personal_sign',
          ],
          chains: ['eip155:1', 'eip155:5'],
          events: ["connect", "disconnect"]
        }
      }

    const { uri, approval } = await signClient.connect({
      requiredNamespaces: proposalNamespace
    });

    if (uri){
      web3Modal.openModal({ uri });
      const session = await approval()
    }
  }

  useEffect(() => {
    if(!signClient){
      createClient();
    }
  }, [signClient])

  return (
    <walletConnectContext.Provider value={{
    connect
    }}>
      {children}
    </walletConnectContext.Provider>
  );
};

export const useWalletConnectContext = () => {
  const {
    connect
  } = useContext(walletConnectContext);

  return {
    connect
  };
};
