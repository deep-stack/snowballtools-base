import React, { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { Domain } from 'gql-client';

import { Button, Typography } from '@material-tailwind/react';

import DomainCard from '../../../../../components/projects/project/settings/DomainCard';
import { useGQLClient } from '../../../../../context/GQLClientContext';
import repositories from '../../../../../assets/repositories.json';
import { OutletContextType } from '../../../../../types/project';

const Domains = () => {
  const client = useGQLClient();
  const { project } = useOutletContext<OutletContextType>();

  const [domains, setDomains] = useState<Domain[]>([]);

  const fetchDomains = async () => {
    if (project === undefined) {
      return;
    }

    const fetchedDomains = await client.getDomains(project.id);
    setDomains(fetchedDomains.domains);
  };

  useEffect(() => {
    fetchDomains();
  }, []);

  return (
    <>
      <div className="flex justify-between p-2">
        <Typography variant="h3">Domain</Typography>
        <Link to="domain/add">
          <Button color="blue" variant="outlined" className="rounded-full">
            <i>^</i> Add domain
          </Button>
        </Link>
      </div>

      {domains.map((domain) => {
        return (
          <DomainCard
            domains={domains}
            domain={domain}
            key={domain.id}
            // TODO: Use github API for getting linked repository
            repo={repositories[0]!}
            project={project}
            onUpdate={fetchDomains}
          />
        );
      })}
    </>
  );
};

export default Domains;
