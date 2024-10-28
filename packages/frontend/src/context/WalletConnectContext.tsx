import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import SignClient from '@walletconnect/sign-client';
import { getSdkError } from '@walletconnect/utils';
import { SessionTypes } from '@walletconnect/types';
import { StargateClient } from '@cosmjs/stargate';

import { walletConnectModal } from '../utils/web3modal';
import {
  VITE_LACONICD_CHAIN_ID,
  VITE_WALLET_CONNECT_ID,
} from 'utils/constants';

interface ClientInterface {
  signClient: SignClient | undefined;
  session: SessionTypes.Struct | undefined;
  loadingSession: boolean;
  onConnect: () => Promise<void>;
  onDisconnect: () => Promise<void>;
  onSessionDelete: () => void;
  accounts: { address: string }[] | undefined;
}

const ClientContext = createContext({} as ClientInterface);

export const useWalletConnectClient = () => {
  return useContext(ClientContext);
};

export const WalletConnectClientProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const [signClient, setSignClient] = useState<SignClient>();
  const [session, setSession] = useState<SessionTypes.Struct>();
  const [loadingSession, setLoadingSession] = useState(true);
  const [accounts, setAccounts] = useState<{ address: string }[]>();

  const isSignClientInitializing = useRef<boolean>(false);

  const createCosmosClient = useCallback(async (endpoint: string) => {
    return await StargateClient.connect(endpoint);
  }, []);

  const onSessionConnect = useCallback(async (session: SessionTypes.Struct) => {
    setSession(session);
  }, []);

  const subscribeToEvents = useCallback(
    async (client: SignClient) => {
      client.on('session_update', ({ topic, params }) => {
        const { namespaces } = params;
        const currentSession = client.session.get(topic);
        const updatedSession = { ...currentSession, namespaces };
        setSession(updatedSession);
      });
    },
    [setSession],
  );

  const onConnect = async () => {
    const proposalNamespace = {
      cosmos: {
        methods: ['cosmos_sendTokens'],
        chains: [`cosmos:${VITE_LACONICD_CHAIN_ID}`],
        events: [],
      },
    };

    try {
      const { uri, approval } = await signClient!.connect({
        requiredNamespaces: proposalNamespace,
      });

      if (uri) {
        walletConnectModal.openModal({ uri });
        const session = await approval();
        onSessionConnect(session);
        walletConnectModal.closeModal();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const onDisconnect = useCallback(async () => {
    if (typeof signClient === 'undefined') {
      throw new Error('WalletConnect is not initialized');
    }
    if (typeof session === 'undefined') {
      throw new Error('Session is not connected');
    }

    await signClient.disconnect({
      topic: session.topic,
      reason: getSdkError('USER_DISCONNECTED'),
    });

    onSessionDelete();
  }, [signClient, session]);

  const onSessionDelete = () => {
    setAccounts(undefined);
    setSession(undefined);
  };

  const checkPersistedState = useCallback(
    async (signClient: SignClient) => {
      if (typeof signClient === 'undefined') {
        throw new Error('WalletConnect is not initialized');
      }

      if (typeof session !== 'undefined') return;
      if (signClient.session.length) {
        const lastKeyIndex = signClient.session.keys.length - 1;
        const previousSsession = signClient.session.get(
          signClient.session.keys[lastKeyIndex],
        );

        await onSessionConnect(previousSsession);
        return previousSsession;
      }
    },
    [session, onSessionConnect],
  );

  const createClient = useCallback(async () => {
    isSignClientInitializing.current = true;
    try {
      const signClient = await SignClient.init({
        projectId: VITE_WALLET_CONNECT_ID,
        metadata: {
          name: 'Deploy App',
          description: '',
          url: window.location.href,
          icons: ['https://avatars.githubusercontent.com/u/92608123'],
        },
      });

      setSignClient(signClient);
      await checkPersistedState(signClient);
      await subscribeToEvents(signClient);
      setLoadingSession(false);
    } catch (e) {
      console.error('error in createClient', e);
    }
    isSignClientInitializing.current = false;
  }, [setSignClient, checkPersistedState, subscribeToEvents]);

  useEffect(() => {
    if (!signClient && !isSignClientInitializing.current) {
      createClient();
    }
  }, [signClient, createClient]);

  useEffect(() => {
    const populateAccounts = async () => {
      if (!session) {
        return;
      }
      const cosmosAddresses = session.namespaces['cosmos'].accounts;

      const cosmosAccounts = cosmosAddresses.map((address) => ({
        address,
      }));

      const allAccounts = cosmosAccounts;

      setAccounts(allAccounts);
    };

    populateAccounts();
  }, [session, createCosmosClient]);

  useEffect(() => {
    if (!signClient) {
      return;
    }

    signClient.on('session_delete', onSessionDelete);

    return () => {
      signClient.off('session_delete', onSessionDelete);
    };
  });

  return (
    <ClientContext.Provider
      value={{
        signClient,
        onConnect,
        onDisconnect,
        onSessionDelete,
        loadingSession,
        session,
        accounts,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};
