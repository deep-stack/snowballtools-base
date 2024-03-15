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
import { SessionTypes } from "@walletconnect/types";
import assert from 'assert';
import * as encoding from "@walletconnect/encoding";


// TODO: Get from env
const PROJECT_ID = "c97365bf9f06d12a7488de36240b0ff4"

interface ContextValue {
  connect: () => Promise<void>;
  signIn: () => Promise<void>;
  isSession: boolean
}

const walletConnectContext = createContext<ContextValue>({
  connect: async () => { },
  signIn: async () => { },
  isSession: false
})

const web3Modal = new WalletConnectModal({
  projectId: PROJECT_ID,
  chains: ['eip155:1']
})

export const WalletConnectProvider = ({ children }: { children: ReactNode }) => {
  const [signClient, setSignClient] = useState<SignClient>()
  const [session, setSession] = useState<SessionTypes.Struct>()
  const [isSession, setisSession] = useState(false)
  // const [chains, setChains] = useState<string[]>([]);
  const [accounts, setAccounts] = useState<string[]>([]);

  const createClient = async () => {

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

    try {
      const proposalNamespace = {
        eip155: {
          methods: [
            'personal_sign',
          ],
          chains: ['eip155:1'],
          events: ["connect", "disconnect"]
        }
      }

      const { uri, approval } = await signClient.connect({
        requiredNamespaces: proposalNamespace
      });

      if (uri) {
        web3Modal.openModal({ uri });
        const currentSession = await approval()
        setSession(currentSession)
        setisSession(true)
        const allNamespaceAccounts = Object.values(currentSession.namespaces)
          .map((namespace) => namespace.accounts)
          .flat();
        const allNamespaceChains = Object.keys(currentSession.namespaces);
        // setChains(allNamespaceChains);
        setAccounts(allNamespaceAccounts);
      }

    } catch (err) {
      console.log("Error in connecting", err)
    } finally {
      web3Modal.closeModal()
    }
  }

  const signIn = async () => {
    assert(signClient, "Sign client doesnot exist")
    assert(session, "Wallet connect session not exist")

    try {
      const result = await signClient.request({
        topic: session.topic,
        chainId: 'eip155:1',
        request: {
          method: 'personal_sign',
          params: [
            encoding.utf8ToHex("sign message", true),
            accounts[0].split(':')[2]
          ]
        }
      })
    } catch (error) {
      console.log("err in signin ", error)
    }
  }

  useEffect(() => {
    if (!signClient) {
      createClient();
    }
  }, [signClient])

  return (
    <walletConnectContext.Provider value={{
      connect,
      signIn,
      isSession
    }}>
      {children}
    </walletConnectContext.Provider>
  );
};

export const useWalletConnectContext = () => {
  const {
    connect, signIn, isSession
  } = useContext(walletConnectContext);

  return {
    connect, signIn, isSession
  };
};
