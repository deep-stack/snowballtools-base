import React, { useState } from 'react';

import { Button, Typography } from '@material-tailwind/react';

import { GitRepositoryDetails } from 'types';
import { DisconnectRepositoryDialog } from 'components/projects/Dialog/DisconnectRepositoryDialog';

const RepoConnectedSection = ({
  linkedRepo,
}: {
  linkedRepo: GitRepositoryDetails;
}) => {
  const [disconnectRepoDialogOpen, setDisconnectRepoDialogOpen] =
    useState(false);

  return (
    <div className="flex gap-4">
      <div>^</div>
      <div className="grow">
        <Typography variant="small" placeholder={''}>
          {linkedRepo.full_name}
        </Typography>
        <Typography variant="small" placeholder={''}>
          Connected just now
        </Typography>
      </div>
      <div>
        <Button
          onClick={() => setDisconnectRepoDialogOpen(true)}
          variant="outlined"
          size="sm"
          placeholder={''}
        >
          ^ Disconnect
        </Button>
      </div>
      <DisconnectRepositoryDialog
        handleCancel={() => setDisconnectRepoDialogOpen((preVal) => !preVal)}
        open={disconnectRepoDialogOpen}
        handleConfirm={() => {
          setDisconnectRepoDialogOpen((preVal) => !preVal);
        }}
      />
    </div>
  );
};

export default RepoConnectedSection;
