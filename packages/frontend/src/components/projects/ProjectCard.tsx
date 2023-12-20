import React from 'react';
import { Link } from 'react-router-dom';

import { relativeTime } from '../../utils/time';
import { ProjectDetails } from '../../types/project';

interface ProjectCardProps {
  project: ProjectDetails;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow">
      <div className="flex gap-2 p-2 items-center">
        <div>{project.icon}</div>
        <div className="grow">
          <Link to={`projects/${project.id}`} className="text-sm text-gray-700">
            {project.name}
          </Link>
          <p className="text-sm text-gray-400">{project.domain}</p>
        </div>
        <div>...</div>
      </div>
      <div className="border-slate-200 border-t-2 border-solid p-4 text-gray-500 text-xs">
        <p>{project.latestCommit.message}</p>
        <p>
          {relativeTime(project.latestCommit.createdAt)} on{' '}
          {project.latestCommit.branch}
        </p>
      </div>
    </div>
  );
};

export default ProjectCard;
