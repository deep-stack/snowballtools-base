import React, { useMemo } from 'react';
import { useParams, Link, useOutletContext } from 'react-router-dom';

import { Button, Typography } from '@material-tailwind/react';

import DomainCard from './DomainCard';
import { DomainDetails } from '../../../../types/project';
import domainsData from '../../../../assets/domains.json';
import repositories from '../../../../assets/repositories.json';

const Domains = () => {
  const { id } = useParams();

  // @ts-expect-error create context type for projects
  const { projects } = useOutletContext();

  const currProject = useMemo(() => {
    return projects.find((data: any) => Number(data.id) === Number(id));
  }, [id]);

  const linkedRepo = useMemo(() => {
    return repositories.find(
      (repo) => repo.id === Number(currProject?.repositoryId),
    );
  }, [currProject]);

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

      {(domainsData as DomainDetails[]).map((domain) => {
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
