import { useState } from 'react';

import { DeleteWebhookDialog } from 'components/projects/Dialog/DeleteWebhookDialog';
import { Button } from 'components/shared/Button';
import { useToast } from 'components/shared/Toast';

interface WebhookCardProps {
  webhookUrl: string;
  onDelete: () => void;
}

const WebhookCard = ({ webhookUrl, onDelete }: WebhookCardProps) => {
  const { toast, dismiss } = useToast();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  return (
    <div className="flex justify-between w-full mb-3">
      {webhookUrl}
      <div className="flex gap-3">
        <Button
          size="sm"
          onClick={() => {
            navigator.clipboard.writeText(webhookUrl);
            toast({
              id: 'webhook_copied',
              title: 'Webhook copied to clipboard',
              variant: 'success',
              onDismiss: dismiss,
            });
          }}
        >
          Copy
        </Button>
        <Button
          size="sm"
          variant="danger"
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
