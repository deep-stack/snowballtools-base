import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from 'react';
import { Octokit, RequestError } from 'octokit';

import { useGQLClient } from './GQLClientContext';

const UNAUTHORIZED_ERROR_CODE = 401;

interface ContextValue {
  octokit: Octokit;
  isAuth: boolean;
  updateAuth: () => void;
}

const OctokitContext = createContext<ContextValue>({
  octokit: new Octokit(),
  isAuth: false,
  updateAuth: () => {},
});

export const OctokitProvider = ({ children }: { children: ReactNode }) => {
  const [authToken, setAuthToken] = useState<string>('');
  const [isAuth, setIsAuth] = useState(false);

  const client = useGQLClient();

  const fetchUser = useCallback(async () => {
    const { user } = await client.getUser();

    if (user.gitHubToken) {
      setAuthToken(user.gitHubToken);
    }
  }, []);

  const updateAuth = useCallback(() => {
    fetchUser();
  }, []);

  const octokit = useMemo(() => {
    if (!authToken) {
      setIsAuth(false);
      return new Octokit();
    }

    setIsAuth(true);
    return new Octokit({ auth: authToken });
  }, [authToken]);

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    // TODO: Handle React component error
    const interceptor = async (error: RequestError | Error) => {
      if (
        error instanceof RequestError &&
        error.status === UNAUTHORIZED_ERROR_CODE
      ) {
        await client.unauthenticateGithub();
        await fetchUser();
      }

      throw error;
    };

    octokit.hook.error('request', interceptor);

    return () => {
      // Remove the interceptor when the component unmounts
      octokit.hook.remove('request', interceptor);
    };
  }, [octokit, client]);

  return (
    <OctokitContext.Provider value={{ octokit, updateAuth, isAuth }}>
      {children}
    </OctokitContext.Provider>
  );
};

export const useOctokit = () => {
  const { octokit, updateAuth, isAuth } = useContext(OctokitContext);

  return { octokit, updateAuth, isAuth };
};
