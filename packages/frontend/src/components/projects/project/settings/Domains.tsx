import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';

import { Button, Typography } from '@material-tailwind/react';

import DomainCard from './DomainCard';
import { DomainDetails } from '../../../../types/project';
import domainsData from '../../../../assets/domains.json';
import repositories from '../../../../assets/repositories.json';
import projectData from '../../../../assets/projects.json';

const Domains = () => {
  const { id } = useParams();

  const currProject = useMemo(() => {
    return projectData.find((data) => data.id === Number(id));
  }, [id]);

  const linkedRepo = useMemo(() => {
    return repositories.find((repo) => repo.id === currProject?.repositoryId);
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
