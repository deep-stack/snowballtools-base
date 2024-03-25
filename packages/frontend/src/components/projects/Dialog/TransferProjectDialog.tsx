import ConfirmDialog, {
  ConfirmDialogProps,
} from 'components/shared/ConfirmDialog';
import React from 'react';

interface TransferProjectDialogProps extends ConfirmDialogProps {
  projectName: string;
  from: string;
  to: string;
}

export const TransferProjectDialog = ({
  projectName,
  from,
  to,
  open,
  handleCancel,
  handleConfirm,
  ...props
}: TransferProjectDialogProps) => {
  return (
    <ConfirmDialog
      {...props}
      dialogTitle="Transfer project?"
      handleCancel={handleCancel}
      open={open}
      confirmButtonTitle="Yes, confirm transfer"
      handleConfirm={handleConfirm}
    >
      <p className="text-sm text-elements-high-em">
        Upon confirmation, your project{' '}
        <span className="text-sm font-mono text-elements-on-secondary bg-controls-secondary rounded px-0.5">
          {projectName}
        </span>{' '}
        will be transferred from{' '}
        <span className="text-sm font-mono text-elements-on-secondary bg-controls-secondary rounded px-0.5">
          {from}
        </span>{' '}
        to{' '}
        <span className="text-sm font-mono text-elements-on-secondary bg-controls-secondary rounded px-0.5">
          {to}
        </span>
        .
      </p>
    </ConfirmDialog>
  );
};
