import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from 'gql-client';

import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Typography,
  Avatar,
} from '@material-tailwind/react';

import { relativeTimeMs } from '../../utils/time';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow">
      <div className="flex gap-2 p-2 items-center">
        <Avatar
          variant="rounded"
          src={project.icon || '/gray.png'}
          placeholder={''}
        />
        <div className="grow">
          <Link to={`projects/${project.id}`}>
            <Typography placeholder={''}>{project.name}</Typography>
            <Typography color="gray" variant="small" placeholder={''}>
              {project.deployments[0]?.domain?.name ??
                'No Production Deployment'}
            </Typography>
          </Link>
        </div>
        <Menu placement="bottom-end">
          <MenuHandler>
            <button>...</button>
          </MenuHandler>
          <MenuList placeholder={''}>
            <MenuItem placeholder={''}>^ Project settings</MenuItem>
            <MenuItem className="text-red-500" placeholder={''}>
              ^ Delete project
            </MenuItem>
          </MenuList>
        </Menu>
      </div>
      <div className="border-t-2 border-solid p-4 bg-gray-50">
        {project.deployments.length > 0 ? (
          <>
            <Typography variant="small" color="gray" placeholder={''}>
              ^ {project.deployments[0].commitMessage}
            </Typography>
            <Typography variant="small" color="gray" placeholder={''}>
              {relativeTimeMs(project.deployments[0].createdAt)} on ^&nbsp;
              {project.deployments[0].branch}
            </Typography>
          </>
        ) : (
          <Typography variant="small" color="gray" placeholder={''}>
            No Production deployment
          </Typography>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
