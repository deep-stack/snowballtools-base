import React from 'react';
import { useParams } from 'react-router-dom';
import { Button, Typography } from '@material-tailwind/react';

import DomainCard from './DomainCard';
import domainsData from '../../../../assets/domains.json';

const Domains = () => {
  const { id } = useParams();
  return (
    <>
      <div className="flex justify-between p-2 ">
        <Typography variant="h2">Domain</Typography>
        <Button variant="outlined" className="rounded-full">
          Add domain
        </Button>
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
