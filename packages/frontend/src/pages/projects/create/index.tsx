import React, { useCallback, useState } from 'react';

import templateDetails from '../../../assets/templates.json';
import TemplateCard from '../../../components/projects/create/TemplateCard';
import RepositoryList from '../../../components/projects/create/RepositoryList';
import ConnectAccount from '../../../components/projects/create/ConnectAccount';

const NewProject = () => {
  const [isGitAuth, setIsGitAuth] = useState(false);
  const [gitToken, setGitToken] = useState('');
  // TODO: Get DB user details for checking if already authenticated to Github

  const handleToken = useCallback((token: string) => {
    setGitToken(token);
    setIsGitAuth(true);
  }, []);

  return (
    <>
      <h5 className="mt-4 ml-4">Start with template</h5>
      <div className="grid grid-cols-3 p-4 gap-4">
        {templateDetails.map((framework, key) => {
          return <TemplateCard framework={framework} key={key} />;
        })}
      </div>
      <h5 className="mt-4 ml-4">Import a repository</h5>
      {isGitAuth ? (
        <RepositoryList token={gitToken} repoSelectionHandler={() => {}} />
      ) : (
        <ConnectAccount onToken={handleToken} />
      )}
    </>
  );
};

export default NewProject;
