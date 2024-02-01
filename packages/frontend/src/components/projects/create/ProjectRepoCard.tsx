import React from 'react';
import { Link } from 'react-router-dom';

import { Chip, IconButton } from '@material-tailwind/react';

import { relativeTime } from '../../../utils/time';
import { GitRepositoryDetails } from '../../../types/project';

interface ProjectRepoCardProps {
  repository: GitRepositoryDetails;
}

const ProjectRepoCard: React.FC<ProjectRepoCardProps> = ({ repository }) => {
  return (
    <Link
      to={`import?owner=${repository.owner?.login}&repo=${repository.name}`}
    >
      <div className="group flex items-center gap-4 text-gray-500 text-xs hover:bg-gray-100 p-2 cursor-pointer">
        <div>^</div>
        <div className="grow">
          <div>
            <span className="text-black">{repository.full_name}</span>
            {repository.visibility === 'private' ? (
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
          <p>{repository.updated_at && relativeTime(repository.updated_at)}</p>
        </div>
        <div className="hidden group-hover:block">
          <IconButton size="sm">{'>'}</IconButton>
        </div>
      </div>
    </Link>
  );
};

export default ProjectRepoCard;
