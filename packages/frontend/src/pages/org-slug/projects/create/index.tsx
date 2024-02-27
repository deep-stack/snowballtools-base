import React, { useState } from 'react';
import { GitType } from 'gql-client';

import templates from 'assets/templates';
import RepositoryList from 'components/projects/create/RepositoryList';
import ConnectAccount from 'components/projects/create/ConnectAccount';
import { useOctokit } from 'context/OctokitContext';
import { Heading } from 'components/shared/Heading';
import { TemplateCard } from 'components/projects/create/TemplateCard';

const NewProject = () => {
  const { octokit, updateAuth, isAuth } = useOctokit();
  const [giteaToken, setGiteaToken] = useState('');

  const onAuthHandler = (token: string, type: GitType) => {
    if (type === GitType.GitHub) {
      updateAuth();
    } else {
      setGiteaToken(token);
    }
  };

  return giteaToken || isAuth ? (
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
      <RepositoryList octokit={octokit} token={giteaToken} />
    </>
  ) : (
    <ConnectAccount onAuth={onAuthHandler} />
  );
};

export default NewProject;
