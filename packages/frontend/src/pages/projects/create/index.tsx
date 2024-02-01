import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { User } from 'gql-client';
import { Octokit, RequestError } from 'octokit';

import templateDetails from '../../../assets/templates.json';
import TemplateCard from '../../../components/projects/create/TemplateCard';
import RepositoryList from '../../../components/projects/create/RepositoryList';
import ConnectAccount from '../../../components/projects/create/ConnectAccount';
import { useGQLClient } from '../../../context/GQLClientContext';

const UNAUTHORIZED_ERROR_CODE = 401;

const NewProject = () => {
  const client = useGQLClient();
  const [user, setUser] = useState<User>();

  const octokit = useMemo(() => {
    if (!user?.gitHubToken) {
      return;
    }

    // TODO: Create github/octokit context
    return new Octokit({ auth: user.gitHubToken });
  }, [user]);

  const fetchUser = useCallback(async () => {
    const { user } = await client.getUser();
    setUser(user);
  }, []);

  const handleToken = useCallback(() => {
    fetchUser();
  }, []);

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
    <>
      <h5 className="mt-4 ml-4">Start with template</h5>
      <div className="grid grid-cols-3 p-4 gap-4">
        {templateDetails.map((framework, key) => {
          return (
            <TemplateCard
              isGitAuth={Boolean(user?.gitHubToken)}
              framework={framework}
              key={key}
            />
          );
        })}
      </div>
      <h5 className="mt-4 ml-4">Import a repository</h5>
      {Boolean(octokit) ? (
        <RepositoryList octokit={octokit!} repoSelectionHandler={() => {}} />
      ) : (
        <ConnectAccount onToken={handleToken} />
      )}
    </>
  );
};

export default NewProject;
