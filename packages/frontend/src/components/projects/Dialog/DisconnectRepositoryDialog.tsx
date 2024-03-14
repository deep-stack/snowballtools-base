import ConfirmDialog, {
  ConfirmDialogProps,
} from 'components/shared/ConfirmDialog';
import React from 'react';

interface DisconnectRepositoryDialogProps extends ConfirmDialogProps {}

export const DisconnectRepositoryDialog = ({
  open,
  handleCancel,
  handleConfirm,
  ...props
}: DisconnectRepositoryDialogProps) => {
  return (
    <ConfirmDialog
      {...props}
      dialogTitle="Disconnect repository?"
      handleCancel={handleCancel}
      open={open}
      confirmButtonTitle="Yes, confirm disconnect"
      handleConfirm={handleConfirm}
      confirmButtonProps={{ variant: 'danger' }}
    >
      <p className="text-sm text-elements-high-em">
        Any data tied to your Git project may become misconfigured. Are you sure
        you want to continue?
      </p>
    </ConfirmDialog>
  );
};
