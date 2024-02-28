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

import { useGQLClient } from './GQLClientContext';

// TODO: Get from env
const GITEA_ORIGIN_URL = 'https://git.vdb.to';

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

      if (user.gitHubToken) {
        setGitHubClient(new GitHubClient(user.gitHubToken));
      }

      if (user.giteaToken) {
        setGiteaClient(new GiteaClient(GITEA_ORIGIN_URL, user.giteaToken));
      }
    },
    [client],
  );

  useEffect(() => {
    updateClients();
  }, []);

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
