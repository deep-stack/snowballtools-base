import ConfirmDialog, {
  ConfirmDialogProps,
} from 'components/shared/ConfirmDialog';
import React from 'react';

interface DeleteWebhookDialogProps extends ConfirmDialogProps {
  webhookUrl: string;
}

export const DeleteWebhookDialog = ({
  webhookUrl,
  open,
  handleCancel,
  handleConfirm,
  ...props
}: DeleteWebhookDialogProps) => {
  return (
    <ConfirmDialog
      {...props}
      dialogTitle="Delete webhook?"
      handleCancel={handleCancel}
      open={open}
      confirmButtonTitle="Yes, confirm delete"
      handleConfirm={handleConfirm}
      confirmButtonProps={{ variant: 'danger' }}
    >
      <p className="text-sm text-elements-mid-em">
        Are you sure you want to delete{' '}
        <span className="text-sm font-mono text-elements-high-em px-0.5">
          {webhookUrl}
        </span>
        ?
      </p>
    </ConfirmDialog>
  );
};
