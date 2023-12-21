import React from 'react';

import { Chip, IconButton } from '@material-tailwind/react';

import { relativeTime } from '../../../utils/time';

interface RepositoryDetails {
  title: string;
  updatedAt: string;
  user: string;
  private: boolean;
}

interface ProjectRepoCardProps {
  repository: RepositoryDetails;
}

const ProjectRepoCard: React.FC<ProjectRepoCardProps> = ({ repository }) => {
  return (
    <div className="group flex items-center gap-4 text-gray-500 text-xs hover:bg-gray-100 p-2 cursor-pointer">
      <div>^</div>
      <div className="grow">
        <div>
          <span className="text-black">
            {repository.user}/{repository.title}
          </span>
          {repository.private ? (
            <Chip
              className="normal-case inline ml-6 bg-[#FED7AA] text-[#EA580C] font-normal"
              size="sm"
              value="Private"
              icon={'^'}
            />
          ) : (
            ''
          )}
        </div>
        <p>{relativeTime(repository.updatedAt)}</p>
      </div>
      <div className="hidden group-hover:block">
        <IconButton size="sm">{'>'}</IconButton>
      </div>
    </div>
  );
};

export default ProjectRepoCard;
