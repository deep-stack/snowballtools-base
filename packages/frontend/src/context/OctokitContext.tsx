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
import { useNavigate, useParams } from 'react-router-dom';
import { useDebounceCallback } from 'usehooks-ts';

import { useGQLClient } from './GQLClientContext';
import { useToast } from 'components/shared/Toast';

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
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const navigate = useNavigate();
  const { orgSlug } = useParams();
  const { toast, dismiss } = useToast();
  const client = useGQLClient();

  const fetchUser = useCallback(async () => {
    const { user } = await client.getUser();

    setAuthToken(user.gitHubToken);
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

  const debouncedUnauthorizedGithubHandler = useDebounceCallback(
    useCallback(
      (error: RequestError) => {
        toast({
          id: 'unauthorized-github-token',
          title: `GitHub authentication error: ${error.message}`,
          variant: 'error',
          onDismiss: dismiss,
        });

        navigate(`/${orgSlug}/projects/create`);
      },
      [toast, navigate, orgSlug],
    ),
    500,
  );

  useEffect(() => {
    // TODO: Handle React component error
    const interceptor = async (error: RequestError | Error) => {
      if (
        error instanceof RequestError &&
        error.status === UNAUTHORIZED_ERROR_CODE
      ) {
        await client.unauthenticateGithub();
        await fetchUser();

        debouncedUnauthorizedGithubHandler(error);
      }

      throw error;
    };

    octokit.hook.error('request', interceptor);

    return () => {
      // Remove the interceptor when the component unmounts
      octokit.hook.remove('request', interceptor);
    };
  }, [octokit, client, debouncedUnauthorizedGithubHandler]);

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
