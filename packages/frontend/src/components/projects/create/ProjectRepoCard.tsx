import React from 'react';

import { IconButton } from '@material-tailwind/react';

import { relativeTime } from '../../../utils/time';

interface RepositoryDetails {
  title: string;
  updatedAt: string;
  user: string;
}

interface ProjectRepoCardProps {
  repository: RepositoryDetails;
}

const ProjectRepoCard: React.FC<ProjectRepoCardProps> = ({ repository }) => {
  return (
    <div className="group flex items-center gap-4 text-gray-500 text-xs hover:bg-gray-100 m-2">
      <div>^</div>
      <div className="grow">
        <p className="text-black">
          {repository.user}/{repository.title}
        </p>
        <p>{relativeTime(repository.updatedAt)}</p>
      </div>
      <div className="hidden group-hover:block">
        <IconButton size="sm">{'>'}</IconButton>
      </div>
    </div>
  );
};

export default ProjectRepoCard;
