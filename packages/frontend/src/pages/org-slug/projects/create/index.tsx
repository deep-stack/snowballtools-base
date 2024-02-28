import React, { useCallback, useEffect, useState } from 'react';
import { GitType } from 'gql-client';
import { GitClient } from 'git-client';

import templates from '../../../../assets/templates';
import TemplateCard from '../../../../components/projects/create/TemplateCard';
import RepositoryList from '../../../../components/projects/create/RepositoryList';
import ConnectAccount from '../../../../components/projects/create/ConnectAccount';
import { useOctokit } from '../../../../context/OctokitContext';
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
      <h5 className="mt-4 ml-4">Start with template</h5>
      <div className="grid grid-cols-3 p-4 gap-4">
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
      <h5 className="mt-4 ml-4">Import a repository</h5>
      <RepositoryList octokit={octokit} gitClient={selectedGit} />
    </>
  ) : (
    <ConnectAccount onSelectGitAccount={selectGitHandler} />
  );
};

export default NewProject;
