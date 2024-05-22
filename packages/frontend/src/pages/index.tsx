import { useCallback, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useGQLClient } from '../context/GQLClientContext';
import { Organization } from 'gql-client';

const Index = () => {
  const client = useGQLClient();
  const [organization, setOrganization] = useState<Organization>();

  const fetchUserOrganizations = useCallback(async () => {
    const { organizations } = await client.getOrganizations();
    // By default information of first organization displayed
    setOrganization(organizations[0]);
  }, []);

  useEffect(() => {
    fetchUserOrganizations();
  }, []);

  return (
    <>
      {Boolean(organization) ? (
        <Navigate to={organization!.slug} />
      ) : (
        <>Loading</>
      )}
    </>
  );
};

export default Index;
