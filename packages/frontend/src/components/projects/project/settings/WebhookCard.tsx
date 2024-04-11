import { useState } from 'react';
import toast from 'react-hot-toast';

import { Button } from '@snowballtools/material-tailwind-react-fork';

import { DeleteWebhookDialog } from 'components/projects/Dialog/DeleteWebhookDialog';

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
      <DeleteWebhookDialog
        handleCancel={() => setDeleteDialogOpen((preVal) => !preVal)}
        open={deleteDialogOpen}
        handleConfirm={() => {
          setDeleteDialogOpen((preVal) => !preVal);
          onDelete();
        }}
        webhookUrl={webhookUrl}
      />
    </div>
  );
};

export default WebhookCard;
