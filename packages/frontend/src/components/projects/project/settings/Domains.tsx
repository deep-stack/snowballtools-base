import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useOutletContext } from 'react-router-dom';

import { Button, Typography } from '@material-tailwind/react';

import DomainCard from './DomainCard';
import { ProjectSearchOutletContext } from '../../../../types/project';
import { useGQLClient } from '../../../../context/GQLClientContext';
import { Domain } from 'gql-client';

const Domains = () => {
  const { id } = useParams();
  const client = useGQLClient();

  const [domains, setDomains] = useState<Domain[]>([]);

  const { projects } = useOutletContext<ProjectSearchOutletContext>();

  const currentProject = useMemo(() => {
    return projects.find((project) => {
      return project.id === id;
    });
  }, [id, projects]);

  const linkedRepo = useMemo(() => {
    return currentProject?.repositories?.find(
      (repo: any) => repo.id === Number(currentProject?.repositoryId),
    );
  }, [currentProject]);

  const fetchDomains = async () => {
    if (currentProject === undefined) {
      return;
    }

    const fetchedDomains = await client.getDomains(currentProject.id);
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
            repo={linkedRepo!}
            project={currentProject!}
          />
        );
      })}
    </>
  );
};

export default Domains;
