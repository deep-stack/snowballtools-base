import React, { useState } from 'react';

import { Button, Typography } from '@material-tailwind/react';

import { RepositoryDetails } from '../../../../types/project';
import ConfirmDialog from '../../../shared/ConfirmDialog';

const RepoConnectedSection = ({
  linkedRepo,
}: {
  linkedRepo: RepositoryDetails;
}) => {
  const [disconnectRepoDialogOpen, setDisconnectRepoDialogOpen] =
    useState(false);

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
        <Button
          onClick={() => setDisconnectRepoDialogOpen(true)}
          variant="outlined"
          size="sm"
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
        <Typography variant="small">
          Any data tied to your Git project may become misconfigured. Are you
          sure you want to continue?
        </Typography>
      </ConfirmDialog>
    </div>
  );
};

export default RepoConnectedSection;
