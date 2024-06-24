import { useState } from 'react';

import { DeleteWebhookDialog } from 'components/projects/Dialog/DeleteWebhookDialog';
import { Button } from 'components/shared/Button';
import { useToast } from 'components/shared/Toast';
import { Input } from 'components/shared/Input';
import { CopyIcon, TrashIcon } from 'components/shared/CustomIcon';

interface WebhookCardProps {
  webhookUrl: string;
  onDelete: () => void;
}

const WebhookCard = ({ webhookUrl, onDelete }: WebhookCardProps) => {
  const { toast, dismiss } = useToast();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  return (
    <div className="flex justify-between w-full mb-3 gap-3">
      <Input value={webhookUrl} disabled />
      <div className="flex gap-3">
        <Button
          iconOnly
          size="md"
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
          <CopyIcon />
        </Button>
        <Button
          iconOnly
          size="md"
          variant="danger"
          onClick={() => {
            setDeleteDialogOpen(true);
          }}
        >
          <TrashIcon />
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
