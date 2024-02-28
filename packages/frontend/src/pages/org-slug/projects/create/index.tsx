import React, { useCallback, useEffect, useState } from 'react';
import { GitType } from 'gql-client';
import { GitClient } from 'git-client';

import templates from 'assets/templates';
import RepositoryList from 'components/projects/create/RepositoryList';
import ConnectAccount from 'components/projects/create/ConnectAccount';
import { useOctokit } from 'context/OctokitContext';
import { Heading } from 'components/shared/Heading';
import { TemplateCard } from 'components/projects/create/TemplateCard';
import { useGitClient } from 'context/GitClientContext';

const NewProject = () => {
  const { octokit } = useOctokit();
  const [selectedGit, setSelectedGit] = useState<GitClient | null>();
  const { gitHubClient, giteaClient } = useGitClient();

  const selectGitHandler = useCallback(
    (type: GitType) => {
      if (type === GitType.GitHub && gitHubClient.token) {
        setSelectedGit(gitHubClient);
      }

      if (type === GitType.Gitea && giteaClient.token) {
        setSelectedGit(giteaClient);
      }
    },
    [gitHubClient, giteaClient],
  );

  useEffect(() => {
    if (gitHubClient.token) {
      setSelectedGit(gitHubClient);
    }

    if (giteaClient.token) {
      setSelectedGit(giteaClient);
    }
  }, [gitHubClient, giteaClient]);

  return selectedGit ? (
    <>
      <div className="space-y-3">
        <Heading as="h3" className="font-medium text-lg">
          Start with template
        </Heading>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {templates.map((template) => {
            return (
              <TemplateCard
                isGitAuth={Boolean(octokit)}
                template={template}
                key={template.id}
              />
            );
          })}
        </div>
      </div>
      <Heading as="h3" className="font-medium text-lg mt-10">
        Import a repository
      </Heading>
      <RepositoryList octokit={octokit} gitClient={selectedGit} />
    </>
  ) : (
    <ConnectAccount onSelectGitAccount={selectGitHandler} />
  );
};

export default NewProject;
