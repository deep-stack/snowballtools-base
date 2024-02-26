import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { Button, Typography } from '@material-tailwind/react';

import ConfirmDialog from '../../../shared/ConfirmDialog';

interface WebhookCardProps {
  webhookUrl: string;
  onDelete: () => void;
}

const WebhookCard = ({ webhookUrl, onDelete }: WebhookCardProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  return (
    <div className="flex justify-between w-full mb-3">
      {webhookUrl}

      <div className="flex gap-3">
        <Button
          size="sm"
          onClick={() => {
            navigator.clipboard.writeText(webhookUrl);
            toast.success('Copied to clipboard');
          }}
          placeholder={''}
        >
          C
        </Button>
        <Button
          color="red"
          size="sm"
          onClick={() => {
            setDeleteDialogOpen(true);
          }}
          placeholder={''}
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
          onDelete();
        }}
        color="red"
      >
        <Typography variant="small" placeholder={''}>
          Are you sure you want to delete the variable{' '}
          <span className="bg-blue-100 p-0.5 rounded-sm">{webhookUrl}</span>?
        </Typography>
      </ConfirmDialog>
    </div>
  );
};

export default WebhookCard;
