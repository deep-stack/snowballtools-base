import React from 'react';
import { Link } from 'react-router-dom';

import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from '@material-tailwind/react';

interface CancelDeploymentDialogProp {
  open: boolean;
  handleOpen: () => void;
}

const CancelDeploymentDialog = ({
  open,
  handleOpen,
}: CancelDeploymentDialogProp) => {
  return (
    <Dialog open={open} handler={handleOpen}>
      <DialogHeader className="flex justify-between">
        <div>Cancel deployment?</div>
        <Button
          variant="outlined"
          onClick={handleOpen}
          className="mr-1 rounded-3xl"
        >
          <span>X</span>
        </Button>
      </DialogHeader>
      <DialogBody>
        This will halt the deployment and you will have to start the process
        from scratch.
      </DialogBody>
      <DialogFooter className="flex justify-center">
        <Button variant="outlined" onClick={handleOpen} className="mr-1">
          <span>Cancel</span>
        </Button>
        <Link to="/projects/create/template">
          <Button variant="gradient" color="red" onClick={handleOpen}>
            <span>Yes, Cancel deployment</span>
          </Button>
        </Link>
      </DialogFooter>
    </Dialog>
  );
};

export default CancelDeploymentDialog;
