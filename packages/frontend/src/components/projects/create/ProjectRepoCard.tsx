import React, { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Chip, IconButton } from '@material-tailwind/react';

import { relativeTimeISO } from '../../../utils/time';
import { GitRepositoryDetails } from '../../../types/project';
import { useGQLClient } from '../../../context/GQLClientContext';

interface ProjectRepoCardProps {
  repository: GitRepositoryDetails;
}

const ProjectRepoCard: React.FC<ProjectRepoCardProps> = ({ repository }) => {
  const client = useGQLClient();
  const navigate = useNavigate();

  const { orgSlug } = useParams();

  const createProject = useCallback(async () => {
    if (!repository) {
      return;
    }

    const { addProject } = await client.addProject(orgSlug!, {
      name: `${repository.owner!.login}-${repository.name}`,
      prodBranch: repository.default_branch!,
      repository: repository.full_name,
    });

    navigate(`import?projectId=${addProject.id}`);
  }, [client, repository]);

  return (
    <div
      className="group flex items-center gap-4 text-gray-500 text-xs hover:bg-gray-100 p-2 cursor-pointer"
      onClick={createProject}
    >
      <div>^</div>
      <div className="grow">
        <div>
          <span className="text-black">{repository.full_name}</span>
          {repository.visibility === 'private' && (
            <Chip
              className="normal-case inline ml-6 font-normal"
              size="sm"
              value="Private"
              icon={'^'}
            />
          )}
        </div>
        <p>{repository.updated_at && relativeTimeISO(repository.updated_at)}</p>
      </div>
      <div className="hidden group-hover:block">
        <IconButton size="sm">{'>'}</IconButton>
      </div>
    </div>
  );
};

export default ProjectRepoCard;
