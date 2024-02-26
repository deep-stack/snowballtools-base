import React from 'react';
import { Outlet, Link, useParams } from 'react-router-dom';

import { IconButton } from '@material-tailwind/react';

import HorizontalLine from '../../../components/HorizontalLine';

const CreateProject = () => {
  const { orgSlug } = useParams();
  return (
    <div className="h-full">
      <div className="flex p-4 items-center">
        <div className="grow">
          <h3 className="text-gray-750 text-2xl">Create new project</h3>
        </div>
        <div>
          <Link to={`/${orgSlug}`}>
            <IconButton
              className="rounded-full"
              variant="outlined"
              placeholder={''}
            >
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
