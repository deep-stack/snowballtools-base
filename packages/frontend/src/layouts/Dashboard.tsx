import React, { useCallback, useEffect, useState } from 'react';
import { Organization } from 'gql-client';

import { Outlet } from 'react-router-dom';

import Sidebar from '../components/Sidebar';
import { useGQLClient } from '../context/GQLClientContext';

// TODO: Implement organization switcher
// TODO: Projects get organization details through routes instead of context
const USER_ORGANIZATION_INDEX = 0;

const Dashboard = () => {
  const client = useGQLClient();
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  const fetchUserOrganizations = useCallback(async () => {
    const { organizations } = await client.getOrganizations();
    setOrganizations(organizations);
  }, []);

  useEffect(() => {
    fetchUserOrganizations();
  }, []);

  return (
    <div className="grid grid-cols-5 h-screen bg-light-blue-50">
      {organizations.length > 0 && (
        <>
          <div className="h-full">
            <Sidebar organization={organizations[USER_ORGANIZATION_INDEX]} />
          </div>
          <div className="col-span-4 h-full p-3 overflow-y-hidden">
            <div className="bg-white rounded-3xl h-full overflow-y-auto">
              <Outlet context={organizations[USER_ORGANIZATION_INDEX]} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
