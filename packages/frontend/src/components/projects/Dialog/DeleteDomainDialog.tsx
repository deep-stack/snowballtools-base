import ConfirmDialog, {
  ConfirmDialogProps,
} from 'components/shared/ConfirmDialog';
import React from 'react';

interface DeleteDomainDialogProps extends ConfirmDialogProps {
  projectName: string;
  domainName: string;
}

export const DeleteDomainDialog = ({
  projectName,
  domainName,
  open,
  handleCancel,
  handleConfirm,
  ...props
}: DeleteDomainDialogProps) => {
  return (
    <ConfirmDialog
      {...props}
      dialogTitle="Delete domain?"
      handleCancel={handleCancel}
      open={open}
      confirmButtonTitle="Yes, delete domain"
      handleConfirm={handleConfirm}
      confirmButtonProps={{ variant: 'danger' }}
    >
      <p className="text-sm text-elements-high-em">
        Once deleted, the project{' '}
        <span className="text-sm font-mono text-elements-on-secondary bg-controls-secondary rounded px-0.5">
          {projectName}
        </span>{' '}
        will not be accessible from the domain{' '}
        <span className="text-sm font-mono text-elements-on-secondary bg-controls-secondary rounded px-0.5">
          {domainName}
        </span>
        .
      </p>
    </ConfirmDialog>
  );
};
