import React from 'react';

import { Button, Typography } from '@material-tailwind/react';

import { RepositoryDetails } from '../../../../types/project';

const RepoConnectedSection = ({
  linkedRepo,
}: {
  linkedRepo: RepositoryDetails;
}) => {
  return (
    <div className="flex gap-4">
      <div>^</div>
      <div className="grow">
        <Typography variant="small">
          {linkedRepo.user}/{linkedRepo.title}
        </Typography>
        <Typography variant="small">Connected just now</Typography>
      </div>
      <div>
        <Button variant="outlined" size="sm">
          ^ Disconnect
        </Button>
      </div>
    </div>
  );
};

export default RepoConnectedSection;
