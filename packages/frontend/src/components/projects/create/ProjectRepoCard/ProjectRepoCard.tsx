import React, { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Spinner } from '@snowballtools/material-tailwind-react-fork';

import { relativeTimeISO } from 'utils/time';
import { GitRepositoryDetails } from '../../../../types/types';
import { useGQLClient } from 'context/GQLClientContext';
import {
  ArrowRightCircleIcon,
  GithubIcon,
  LockIcon,
} from 'components/shared/CustomIcon';
import { Button } from 'components/shared/Button';
import { useToast } from 'components/shared/Toast';

interface ProjectRepoCardProps {
  repository: GitRepositoryDetails;
}

export const ProjectRepoCard: React.FC<ProjectRepoCardProps> = ({
  repository,
}) => {
  const client = useGQLClient();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { orgSlug } = useParams();
  const { toast, dismiss } = useToast();

  const createProject = useCallback(async () => {
    if (!repository || !orgSlug) {
      return toast({
        id: 'missing-repository-or-org-slug',
        title: 'Repository or organization slug is missing',
        variant: 'error',
        onDismiss: dismiss,
      });
    }

    try {
      setIsLoading(true);
      const { addProject } = await client.addProject(orgSlug, {
        name: `${repository.owner?.login}-${repository.name}`,
        prodBranch: repository.default_branch as string,
        repository: repository.full_name,
        // TODO: Compute template from repo
        template: 'webapp',
      });
      if (addProject) {
        navigate(`import?projectId=${addProject.id}`);
      } else {
        toast({
          id: 'failed-to-create-project',
          title: 'Failed to create project',
          variant: 'error',
          onDismiss: dismiss,
        });
      }
    } catch (error) {
      console.error((error as Error).message);
      toast({
        id: 'failed-to-create-project',
        title: 'Failed to create project',
        variant: 'error',
        onDismiss: dismiss,
      });
    } finally {
      setIsLoading(false);
    }
  }, [client, repository, orgSlug, setIsLoading, navigate, toast]);

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
