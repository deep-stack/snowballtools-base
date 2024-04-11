import React from 'react';

import templates from 'assets/templates';
import { RepositoryList } from 'components/projects/create/RepositoryList';
import ConnectAccount from 'components/projects/create/ConnectAccount';
import { useOctokit } from 'context/OctokitContext';
import { Heading } from 'components/shared/Heading';
import { TemplateCard } from 'components/projects/create/TemplateCard';

const NewProject = () => {
  const { octokit, updateAuth, isAuth } = useOctokit();

  return isAuth ? (
    <>
      <div className="space-y-3">
        <Heading as="h3" className="font-medium text-lg pl-1">
          Start with a template
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
      <Heading as="h3" className="font-medium text-lg mt-10 pl-1 mb-3">
        Import a repository
      </Heading>
      <RepositoryList />
    </>
  ) : (
    <ConnectAccount onAuth={updateAuth} />
  );
};

export default NewProject;
