import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button, Typography } from '@material-tailwind/react';

import DomainCard from './DomainCard';
import domainsData from '../../../../assets/domains.json';

const Domains = () => {
  const { id } = useParams();

  return (
    <>
      <div className="flex justify-between p-2">
        <Typography variant="h2">Domain</Typography>
        <Link to="domain/add">
          <Button color="blue" variant="outlined" className="rounded-full">
            <i>^</i> Add domain
          </Button>
        </Link>
      </div>

      {domainsData
        .filter((domain) => {
          return Number(id) == domain.projectid;
        })
        .map((domain) => {
          return (
            <DomainCard
              status={domain.status}
              domain={domain.domain}
              key={domain.domainid}
            />
          );
        })}
    </>
  );
};

export default Domains;
