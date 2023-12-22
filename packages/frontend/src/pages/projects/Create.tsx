import React from 'react';
import { Outlet, Link } from 'react-router-dom';

import { IconButton } from '@material-tailwind/react';

import HorizontalLine from '../../components/HorizontalLine';

const CreateProject = () => {
  return (
    <div className="h-full">
      <div className="flex p-4 items-center">
        <div className="grow">
          <h3 className="text-gray-750 text-2xl">Create new project</h3>
        </div>
        <div>
          <Link to="/">
            <IconButton className="rounded-full" variant="outlined">
              X
            </IconButton>
          </Link>
        </div>
      </div>
      <HorizontalLine />
      <Outlet />
    </div>
  );
};

export default CreateProject;
