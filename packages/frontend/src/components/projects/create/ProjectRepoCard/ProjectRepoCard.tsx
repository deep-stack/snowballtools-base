import React, { useCallback } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

import { Spinner } from '@material-tailwind/react';

import { relativeTimeISO } from 'utils/time';
import { GitRepositoryDetails } from 'types';
import { useGQLClient } from 'context/GQLClientContext';
import {
  ArrowRightCircleIcon,
  GithubIcon,
  LockIcon,
} from 'components/shared/CustomIcon';
import { Button } from 'components/shared/Button';

interface ProjectRepoCardProps {
  repository: GitRepositoryDetails;
}

export const ProjectRepoCard: React.FC<ProjectRepoCardProps> = ({
  repository,
}) => {
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
      className="group flex items-start sm:items-center gap-3 px-3 py-3 cursor-pointer rounded-xl hover:bg-base-bg-emphasized relative"
      onClick={createProject}
    >
      {/* Icon container */}
      <div className="w-10 h-10 bg-base-bg rounded-md justify-center items-center flex">
        <GithubIcon />
      </div>
      {/* Content */}
      <div className="flex flex-1 gap-3 flex-wrap">
        <div className="flex flex-col gap-1">
          <p className="text-elements-high-em text-sm font-medium tracking-[-0.006em]">
            {repository.full_name}
          </p>
          <p className="text-elements-low-em text-xs">
            {repository.updated_at && relativeTimeISO(repository.updated_at)}
          </p>
        </div>
        {repository.visibility === 'private' && (
          <div className="bg-orange-50 border border-orange-200 px-2 py-1 flex items-center gap-1 rounded-lg text-xs text-orange-600 h-fit">
            <LockIcon />
            Private
          </div>
        )}
      </div>
      {/* Right action */}
      {isLoading ? (
        <Spinner className="h-4 w-4 absolute right-3" />
      ) : (
        <Button
          variant="tertiary"
          size="sm"
          iconOnly
          className="sm:group-hover:flex hidden absolute right-3"
        >
          <ArrowRightCircleIcon />
        </Button>
      )}
    </div>
  );
};
