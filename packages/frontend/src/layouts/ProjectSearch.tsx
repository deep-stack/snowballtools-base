import React, { useCallback, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { User } from 'gql-client';

// import { Tooltip } from '@material-tailwind/react';

import HorizontalLine from '../components/HorizontalLine';
import ProjectSearchBar from '../components/projects/ProjectSearchBar';
import { useGQLClient } from '../context/GQLClientContext';
import { formatAddress } from '../utils/format';
import { NotificationBellIcon, PlusIcon } from 'components/shared/CustomIcon';
import { Button } from 'components/shared/Button';

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
        <div className="flex pl-3 pr-8 pt-3 pb-3 items-center">
          <div className="grow">
            <ProjectSearchBar
              onChange={(project) => {
                navigate(
                  `/${project.organization.slug}/projects/${project.id}`,
                );
              }}
            />
          </div>
          <Button variant={'secondary'} iconOnly>
            <PlusIcon />
          </Button>
          <Button variant={'ghost'} iconOnly>
            <NotificationBellIcon />
          </Button>
          {user?.name ? (
            <Button variant={'tertiary'}>{formatAddress(user.name)}</Button>
          ) : null}
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
