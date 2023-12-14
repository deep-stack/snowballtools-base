import React from 'react';
import { DateTime } from 'luxon';
import { Link } from 'react-router-dom';

interface projectDetails {
  icon: string;
  title: string;
  domain: string;
  id: number;
  latestCommit: {
    [key: string]: string;
  };
}

interface ProjectCardProps {
  project: projectDetails;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow">
      <div className="flex gap-2 p-2 items-center">
        <div>{project.icon}</div>
        <div className="grow">
          <Link to={`projects/${project.id}`} className="text-sm text-gray-700">
            {project.title}
          </Link>
          <p className="text-sm text-gray-400">{project.domain}</p>
        </div>
        <div>...</div>
      </div>
      <div className="border-slate-200 border-t-2 border-solid p-4 text-gray-500 text-xs">
        <p>{project.latestCommit.message}</p>
        <p>
          {DateTime.fromISO(project.latestCommit.time).toRelative()} on{' '}
          {project.latestCommit.branch}
        </p>
      </div>
    </div>
  );
};

export default ProjectCard;
