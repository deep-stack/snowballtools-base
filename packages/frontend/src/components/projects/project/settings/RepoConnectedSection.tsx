import React, { useState } from 'react';

import { Button, Typography } from '@material-tailwind/react';

import { GitRepositoryDetails } from '../../../../types';
import ConfirmDialog from '../../../shared/ConfirmDialog';

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
      <ConfirmDialog
        dialogTitle="Disconnect repository?"
        handleOpen={() => setDisconnectRepoDialogOpen((preVal) => !preVal)}
        open={disconnectRepoDialogOpen}
        confirmButtonTitle="Yes, confirm disconnect"
        handleConfirm={() => {
          setDisconnectRepoDialogOpen((preVal) => !preVal);
        }}
        color="red"
      >
        <Typography variant="small" placeholder={''}>
          Any data tied to your Git project may become misconfigured. Are you
          sure you want to continue?
        </Typography>
      </ConfirmDialog>
    </div>
  );
};

export default RepoConnectedSection;
