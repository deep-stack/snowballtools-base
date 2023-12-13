import React from 'react';
import { DateTime } from 'luxon';

interface RepositoryDetails {
  title: string;
  updatedTime: string;
}

interface ProjectRepoCardProps {
  repository: RepositoryDetails;
}

const ProjectRepoCard: React.FC<ProjectRepoCardProps> = ({ repository }) => {
  return (
    <div className="flex text-gray-500 text-xs bg-gray-100 m-2">
      <div>^</div>
      <div className="grow">
        <p>{repository.title}</p>
        <p>{DateTime.fromISO(repository.updatedTime).toRelative()}</p>
      </div>
    </div>
  );
};

export default ProjectRepoCard;
