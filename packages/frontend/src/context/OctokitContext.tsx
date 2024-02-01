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
  octokit: Octokit | null;
  updateAuth: () => void;
}

const OctokitContext = createContext<ContextValue>({
  octokit: null,
  updateAuth: () => {},
});

export const OctokitProvider = ({ children }: { children: ReactNode }) => {
  const [authToken, setAuthToken] = useState<string>('');
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
      return null;
    }

    return new Octokit({ auth: authToken });
  }, [authToken]);

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (!octokit) {
      return;
    }

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
    <OctokitContext.Provider value={{ octokit, updateAuth }}>
      {children}
    </OctokitContext.Provider>
  );
};

export const useOctokit = () => {
  const { octokit, updateAuth } = useContext(OctokitContext);

  return { octokit, updateAuth };
};
