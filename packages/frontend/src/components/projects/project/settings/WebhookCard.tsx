import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { Button, Typography } from '@material-tailwind/react';

import ConfirmDialog from '../../../shared/ConfirmDialog';

const WebhookCard = (props: {
  webhooksArray: string[];
  webhookUrl: string;
  handleDelete: () => void;
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  return (
    <div className="flex justify-between w-full mb-3">
      {props.webhookUrl}

      <div className="flex gap-3">
        <Button
          size="sm"
          onClick={() => {
            navigator.clipboard.writeText(props.webhookUrl);
            toast.success('Copied to clipboard');
          }}
        >
          C
        </Button>
        <Button
          color="red"
          size="sm"
          onClick={() => {
            setDeleteDialogOpen(true);
          }}
        >
          X
        </Button>
      </div>

      <ConfirmDialog
        dialogTitle="Delete webhook"
        handleOpen={() => setDeleteDialogOpen((preVal) => !preVal)}
        open={deleteDialogOpen}
        confirmButtonTitle="Yes, Confirm delete"
        handleConfirm={() => {
          setDeleteDialogOpen((preVal) => !preVal);
          props.handleDelete();
        }}
        color="red"
      >
        <Typography variant="small">
          Are you sure you want to delete the variable{' '}
          <span className="bg-blue-100 p-0.5 rounded-sm">
            {props.webhookUrl}
          </span>
          ?
        </Typography>
      </ConfirmDialog>
    </div>
  );
};

export default WebhookCard;
