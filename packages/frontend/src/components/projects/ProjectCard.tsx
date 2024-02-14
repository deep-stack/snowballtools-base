import React from 'react';
import { Link } from 'react-router-dom';

import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Typography,
  Avatar,
} from '@material-tailwind/react';

import { relativeTimeISO } from '../../utils/time';
import { ProjectDetails } from '../../types/project';

interface ProjectCardProps {
  project: ProjectDetails;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow">
      <div className="flex gap-2 p-2 items-center">
        <Avatar variant="square" src={project.icon} />
        <div className="grow">
          <Link to={`projects/${project.id}`}>
            <Typography>{project.name}</Typography>
            <Typography color="gray" variant="small">
              {project.deployments[0]?.domain?.name ??
                'No Production Deployment'}
            </Typography>
          </Link>
        </div>
        <Menu placement="bottom-end">
          <MenuHandler>
            <button>...</button>
          </MenuHandler>
          <MenuList>
            <MenuItem>^ Project settings</MenuItem>
            <MenuItem className="text-red-500">^ Delete project</MenuItem>
          </MenuList>
        </Menu>
      </div>
      <div className="border-t-2 border-solid p-4 bg-gray-50">
        <Typography variant="small" color="gray">
          ^ {project.latestCommit.message}
        </Typography>
        <Typography variant="small" color="gray">
          {relativeTimeISO(project.latestCommit.createdAt)} on ^&nbsp;
          {project.latestCommit.branch}
        </Typography>
      </div>
    </div>
  );
};

export default ProjectCard;
