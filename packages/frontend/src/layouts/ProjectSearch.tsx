import React, { useCallback, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { User } from 'gql-client';

import { IconButton, Tooltip, Typography } from '@material-tailwind/react';

import HorizontalLine from '../components/HorizontalLine';
import ProjectSearchBar from '../components/projects/ProjectSearchBar';
import { useGQLClient } from '../context/GQLClientContext';
import { formatAddress } from '../utils/format';

const ProjectSearch = () => {
  const navigate = useNavigate();
  const client = useGQLClient();
  const [user, setUser] = useState<User>();

  const fetchUser = useCallback(async () => {
    const { user } = await client.getUser();
    setUser(user);
  }, []);

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div>
      <div className="sticky top-0 bg-white z-30">
        <div className="flex p-5">
          <div className="grow mr-2">
            <ProjectSearchBar
              onChange={(project) => {
                navigate(
                  `/${project.organization.slug}/projects/${project.id}`,
                );
              }}
            />
          </div>
          <IconButton
            color="blue"
            className="rounded-full mr-2"
            placeholder={''}
          >
            <Typography variant="h5" placeholder={''}>
              +
            </Typography>
          </IconButton>
          <div className="mr-2 flex items-center">
            <Typography placeholder={''}>^</Typography>
          </div>
          <div className="px-2 py-1 bg-blue-gray-50 rounded-lg flex items-center">
            {user?.name && (
              <Tooltip content={user.name}>{formatAddress(user.name)}</Tooltip>
            )}
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
