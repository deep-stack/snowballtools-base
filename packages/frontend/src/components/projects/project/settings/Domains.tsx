import React, { useMemo } from 'react';
import { useParams, Link, useOutletContext } from 'react-router-dom';

import { Button, Typography } from '@material-tailwind/react';

import DomainCard from './DomainCard';
import {
  DomainDetails,
  ProjectSearchOutletContext,
} from '../../../../types/project';

const Domains = () => {
  const { id } = useParams();

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

  const domains = currentProject?.deployments
    .filter((deployment) => {
      return deployment.domain != null;
    })
    .map((deployment) => deployment.domain);

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

      {(domains as unknown as DomainDetails[]).map((domain) => {
        return (
          <DomainCard
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
