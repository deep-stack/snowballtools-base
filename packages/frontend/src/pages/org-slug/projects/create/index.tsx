import React from 'react';

import templates from '../../../../assets/templates';
import TemplateCard from '../../../../components/projects/create/TemplateCard';
import RepositoryList from '../../../../components/projects/create/RepositoryList';
import ConnectAccount from '../../../../components/projects/create/ConnectAccount';
import { useOctokit } from '../../../../context/OctokitContext';

const NewProject = () => {
  const { octokit, updateAuth, isAuth } = useOctokit();

  return isAuth ? (
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
      <RepositoryList octokit={octokit} />
    </>
  ) : (
    <ConnectAccount onAuth={updateAuth} />
  );
};

export default NewProject;
