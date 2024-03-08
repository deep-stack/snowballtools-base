import React from 'react';

import { color } from '@material-tailwind/react/types/components/button';
import { Modal, ModalProps } from './Modal';
import { Button } from './Button';

type ConfirmDialogProp = ModalProps & {
  children: React.ReactNode;
  dialogTitle: string;
  open: boolean;
  handleOpen: () => void;
  confirmButtonTitle: string;
  handleConfirm?: () => void;
  color: color;
};

const ConfirmDialog = ({
  children,
  dialogTitle,
  handleOpen,
  confirmButtonTitle,
  handleConfirm,
  ...props
}: ConfirmDialogProp) => {
  return (
    <Modal {...props}>
      <Modal.Content>
        <Modal.Header>{dialogTitle}</Modal.Header>
        <Modal.Body>{children}</Modal.Body>
        <Modal.Footer className="flex justify-start gap-2">
          <Button variant="tertiary" onClick={handleOpen}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>{confirmButtonTitle}</Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default ConfirmDialog;
