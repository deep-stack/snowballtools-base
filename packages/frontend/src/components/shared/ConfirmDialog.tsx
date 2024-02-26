import React from 'react';

import { color } from '@material-tailwind/react/types/components/button';
import {
  Typography,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from '@material-tailwind/react';

type ConfirmDialogProp = {
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
  open,
  handleOpen,
  confirmButtonTitle,
  handleConfirm,
  color,
}: ConfirmDialogProp) => {
  return (
    <Dialog open={open} handler={handleOpen} placeholder={''}>
      <DialogHeader className="flex justify-between" placeholder={''}>
        <Typography variant="h6" placeholder={''}>
          {dialogTitle}{' '}
        </Typography>
        <Button
          variant="outlined"
          onClick={handleOpen}
          className=" rounded-full"
          placeholder={''}
        >
          X
        </Button>
      </DialogHeader>
      <DialogBody placeholder={''}>{children}</DialogBody>
      <DialogFooter className="flex justify-start gap-2" placeholder={''}>
        <Button variant="outlined" onClick={handleOpen} placeholder={''}>
          Cancel
        </Button>
        <Button
          variant="gradient"
          color={color}
          onClick={handleConfirm}
          placeholder={''}
        >
          {confirmButtonTitle}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default ConfirmDialog;
