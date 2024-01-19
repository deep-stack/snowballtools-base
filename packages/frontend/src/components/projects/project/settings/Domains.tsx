import React, { useMemo } from 'react';
import { useParams, Link, useOutletContext } from 'react-router-dom';

import { Button, Typography } from '@material-tailwind/react';

import DomainCard from './DomainCard';
import { DomainDetails } from '../../../../types/project';

const Domains = () => {
  const { id } = useParams();

  // @ts-expect-error create context type for projects
  const { projects } = useOutletContext();

  const currProject = useMemo(() => {
    return projects.find((data: any) => {
      return Number(data?.id) === Number(id);
    });
  }, [id]);

  const linkedRepo = useMemo(() => {
    return currProject.repositories.find(
      (repo: any) => repo.id === Number(currProject?.repositoryId),
    );
  }, [currProject]);

  const domains = currProject.deployments
    .filter((deployment: any) => {
      return deployment.domain != null;
    })
    .map((deployment: any) => deployment.domain);

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

      {(domains as DomainDetails[]).map((domain) => {
        return (
          <DomainCard
            domain={domain}
            key={domain.id}
            repo={linkedRepo!}
            project={currProject!}
          />
        );
      })}
    </>
  );
};

export default Domains;
