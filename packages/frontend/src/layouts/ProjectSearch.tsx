import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { IconButton, Typography } from '@material-tailwind/react';

import HorizontalLine from '../components/HorizontalLine';
import ProjectSearchBar from '../components/projects/ProjectSearchBar';

const ProjectSearch = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="sticky top-0 bg-white z-30">
        <div className="flex p-5">
          <div className="grow mr-2">
            <ProjectSearchBar
              onChange={(project) => {
                navigate(`/projects/${project.id}`);
              }}
            />
          </div>
          <IconButton color="blue" className="rounded-full mr-2">
            <Typography variant="h5">+</Typography>
          </IconButton>
          <div className="mr-2 flex items-center">
            <Typography>^</Typography>
          </div>
          <div className="px-2 py-1 bg-blue-gray-50 rounded-lg">
            <Typography variant="lead">SY</Typography>
          </div>
        </div>
        <HorizontalLine />
      </div>
      <div className="z-0">
        <Outlet />
      </div>
    </div>
  );
};

export default ProjectSearch;
