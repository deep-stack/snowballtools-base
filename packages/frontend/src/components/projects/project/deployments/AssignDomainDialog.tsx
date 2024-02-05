import React from 'react';
import { CopyBlock, atomOneLight } from 'react-code-blocks';
import { Link } from 'react-router-dom';

import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from '@material-tailwind/react';

interface AssignDomainProps {
  open: boolean;
  handleOpen: () => void;
}

const AssignDomainDialog = ({ open, handleOpen }: AssignDomainProps) => {
  return (
    <Dialog open={open} handler={handleOpen}>
      <DialogHeader>Assign Domain</DialogHeader>
      <DialogBody>
        In order to assign a domain to your production deployments, configure it
        in the{' '}
        {/* TODO: Navigate to settings tab panel after clicking on project settings */}
        <Link to="" className="text-light-blue-800 inline">
          project settings{' '}
        </Link>
        (recommended). If you want to assign to this specific deployment,
        however, you can do so using our command-line interface:
        <CopyBlock
          text="snowball alias <deployment> <domain>"
          language=""
          showLineNumbers={false}
          theme={atomOneLight}
        />
      </DialogBody>
      <DialogFooter className="flex justify-start">
        <Button
          className="rounded-3xl"
          variant="gradient"
          color="blue"
          onClick={handleOpen}
        >
          <span>Okay</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default AssignDomainDialog;
