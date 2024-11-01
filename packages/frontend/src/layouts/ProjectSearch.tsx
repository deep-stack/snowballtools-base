import { useCallback, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { User } from 'gql-client';

import HorizontalLine from 'components/HorizontalLine';
import { useGQLClient } from 'context/GQLClientContext';
import { NotificationBellIcon, PlusIcon } from 'components/shared/CustomIcon';
import { Button } from 'components/shared/Button';
import { formatAddress } from 'utils/format';
import { ProjectSearchBar } from 'components/projects/ProjectSearchBar';

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

  const fetchOrgSlug = useCallback(async () => {
    const { organizations } = await client.getOrganizations();
    // TODO: Get the selected organization. This is temp
    return organizations[0].slug;
  }, []);

  return (
    <section className="h-full flex flex-col">
      {/* Header */}
      <div className="sticky hidden lg:block top-0 border-b bg-base-bg border-border-separator/[0.06] hover:z-30">
        <div className="flex pr-6 pl-2 py-2 items-center">
          <div className="flex-1">
            <ProjectSearchBar
              onChange={(project) => {
                navigate(
                  `/${project.organization.slug}/projects/${project.id}`,
                );
              }}
            />
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              iconOnly
              onClick={() => {
                fetchOrgSlug().then((organizationSlug) => {
                  navigate(`/${organizationSlug}/projects/create`);
                });
              }}
            >
              <PlusIcon />
            </Button>
            <Button variant="ghost" iconOnly>
              <NotificationBellIcon />
            </Button>
            {user?.name && (
              <p className="text-sm tracking-[-0.006em] text-elements-high-em">
                {formatAddress(user.name)}
              </p>
            )}
          </div>
        </div>
        <HorizontalLine />
      </div>

      {/* Content */}
      <section className="h-full z-0 overflow-y-auto">
        <Outlet />
      </section>
    </section>
  );
};

export default ProjectSearch;
