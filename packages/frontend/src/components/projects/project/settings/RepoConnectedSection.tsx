import { useState } from 'react';

import {
  Button,
  Typography,
} from '@snowballtools/material-tailwind-react-fork';

import { GitRepositoryDetails } from '../../../../types/types';
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
        <Typography variant="small">{linkedRepo.full_name}</Typography>
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
