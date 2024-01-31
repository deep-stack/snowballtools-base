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
  handleConfirm?: (() => void) | (() => Promise<void>);
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
    <Dialog open={open} handler={handleOpen}>
      <DialogHeader className="flex justify-between">
        <Typography variant="h6">{dialogTitle} </Typography>
        <Button
          variant="outlined"
          onClick={handleOpen}
          className=" rounded-full"
        >
          X
        </Button>
      </DialogHeader>
      <DialogBody>{children}</DialogBody>
      <DialogFooter className="flex justify-start gap-2">
        <Button variant="outlined" onClick={handleOpen}>
          Cancel
        </Button>
        <Button variant="gradient" color={color} onClick={handleConfirm}>
          {confirmButtonTitle}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default ConfirmDialog;
