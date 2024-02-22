import React, { useCallback } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

import { Chip, IconButton, Spinner } from '@material-tailwind/react';

import { relativeTimeISO } from '../../../utils/time';
import { GitRepositoryDetails } from '../../../types';
import { useGQLClient } from '../../../context/GQLClientContext';

interface ProjectRepoCardProps {
  repository: GitRepositoryDetails;
}

const ProjectRepoCard: React.FC<ProjectRepoCardProps> = ({ repository }) => {
  const client = useGQLClient();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);

  const { orgSlug } = useParams();

  const createProject = useCallback(async () => {
    if (!repository) {
      return;
    }

    setIsLoading(true);
    const { addProject } = await client.addProject(orgSlug!, {
      name: `${repository.owner!.login}-${repository.name}`,
      prodBranch: repository.default_branch!,
      repository: repository.full_name,
      // TODO: Compute template from repo
      template: 'webapp',
    });

    if (Boolean(addProject)) {
      setIsLoading(false);
      navigate(`import?projectId=${addProject.id}`);
    } else {
      setIsLoading(false);
      toast.error('Failed to create project');
    }
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
      {isLoading ? (
        <Spinner className="h-4 w-4" />
      ) : (
        <div className="hidden group-hover:block">
          <IconButton size="sm">{'>'}</IconButton>
        </div>
      )}
    </div>
  );
};

export default ProjectRepoCard;
