import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { GitType } from 'gql-client';
import { GitHubClient, GiteaClient } from 'git-client';
import assert from 'assert';

import { useGQLClient } from './GQLClientContext';

const GITEA_ORIGIN_URL = process.env.REACT_APP_GITEA_ORIGIN;
assert(GITEA_ORIGIN_URL, 'Gitea origin URL not provided');
interface ContextValue {
  gitHubClient: GitHubClient;
  giteaClient: GiteaClient;
  updateClients: (token?: string, gitType?: GitType) => Promise<void>;
}

const GitClientContext = createContext<ContextValue>({
  gitHubClient: new GitHubClient(),
  giteaClient: new GiteaClient(GITEA_ORIGIN_URL),
  updateClients: async () => {},
});

export const GitClientProvider = ({ children }: { children: ReactNode }) => {
  const client = useGQLClient();
  const [gitHubClient, setGitHubClient] = useState(new GitHubClient());
  const [giteaClient, setGiteaClient] = useState(
    new GiteaClient(GITEA_ORIGIN_URL),
  );

  const updateClients = useCallback(
    async (token?: string, gitType?: GitType) => {
      if (token) {
        if (gitType === GitType.GitHub) {
          setGitHubClient(new GitHubClient(token));
        }

        if (gitType === GitType.Gitea) {
          setGiteaClient(new GiteaClient(GITEA_ORIGIN_URL, token));
        }

        return;
      }

      const { user } = await client.getUser();

      setGitHubClient(new GitHubClient(user.gitHubToken));
      setGiteaClient(new GiteaClient(GITEA_ORIGIN_URL, user.giteaToken));
    },
    [client],
  );

  useEffect(() => {
    updateClients();
  }, []);

  // eslint-disable-next-line
  (window as any).unauthenticateGit = useCallback(async () => {
    const res = await client.unauthenticateGit();
    await updateClients();
    return res;
  }, [client]);

  return (
    <GitClientContext.Provider
      value={{
        gitHubClient,
        giteaClient,
        updateClients,
      }}
    >
      {children}
    </GitClientContext.Provider>
  );
};

export const useGitClient = () => {
  const { gitHubClient, giteaClient, updateClients } =
    useContext(GitClientContext);

  return {
    gitHubClient,
    giteaClient,
    updateClients,
  };
};
