import { ReactNode } from 'react';
import { Modal, ModalProps } from './Modal';
import { Button, ButtonOrLinkProps } from './Button';

export type ConfirmDialogProps = ModalProps & {
  children?: ReactNode;
  dialogTitle?: string;
  open: boolean;
  handleCancel: () => void;
  confirmButtonTitle?: string;
  handleConfirm?: () => void;
  cancelButtonProps?: ButtonOrLinkProps;
  confirmButtonProps?: ButtonOrLinkProps;
};

const ConfirmDialog = ({
  children,
  dialogTitle,
  handleCancel,
  confirmButtonTitle,
  handleConfirm,
  cancelButtonProps,
  confirmButtonProps,
  ...props
}: ConfirmDialogProps) => {
  // Close the dialog when the user clicks outside of it
  const handleOpenChange = (open: boolean) => {
    if (!open) return handleCancel?.();
  };

  return (
    <Modal {...props} onOpenChange={handleOpenChange}>
      <Modal.Content>
        <Modal.Header>{dialogTitle}</Modal.Header>
        <Modal.Body>{children}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="tertiary"
            onClick={handleCancel}
            {...cancelButtonProps}
          >
            Cancel
          </Button>
          <Button onClick={handleConfirm} {...confirmButtonProps}>
            {confirmButtonTitle}
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default ConfirmDialog;
