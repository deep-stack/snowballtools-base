import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Button } from '@material-tailwind/react';

import { useOctokit } from '../../../context/OctokitContext';
import { GitRepositoryDetails } from '../../../types/project';
import Deploy from '../../../components/projects/create/Deploy';
import { useGQLClient } from '../../../context/GQLClientContext';

const Import = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { octokit } = useOctokit();
  const client = useGQLClient();
  const [gitRepo, setGitRepo] = useState<GitRepositoryDetails>();

  useEffect(() => {
    const fetchRepo = async () => {
      if (!octokit) {
        return;
      }

      const result = await octokit.rest.repos.get({
        owner: searchParams.get('owner') ?? '',
        repo: searchParams.get('repo') ?? '',
      });

      setGitRepo(result.data);
    };

    fetchRepo();
  }, [searchParams, octokit]);

  const createProjectAndCreate = useCallback(async () => {
    if (!gitRepo) {
      return;
    }

    const { addProject } = await client.addProject({
      // TODO: Implement form for setting project name
      name: `${gitRepo.owner!.login}-${gitRepo.name}`,
      // TODO: Get organization id from context or URL
      organizationId: String(1),
      prodBranch: gitRepo.default_branch ?? 'main',
      repository: gitRepo.full_name,
    });

    navigate(`/projects/create/success/${addProject.id}`);
  }, [client, gitRepo]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex w-5/6 my-4 bg-gray-200 rounded-xl p-6">
        <div>^</div>
        <div className="grow">{gitRepo?.full_name}</div>
      </div>

      <Deploy />

      <Button onClick={createProjectAndCreate}>
        CREATE PROJECT (FOR DEMO)
      </Button>
    </div>
  );
};

export default Import;
