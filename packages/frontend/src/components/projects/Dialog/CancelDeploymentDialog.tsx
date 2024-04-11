import ConfirmDialog, {
  ConfirmDialogProps,
} from 'components/shared/ConfirmDialog';

interface CancelDeploymentDialogProps extends ConfirmDialogProps {}

export const CancelDeploymentDialog = ({
  open,
  handleCancel,
  handleConfirm,
  ...props
}: CancelDeploymentDialogProps) => {
  return (
    <ConfirmDialog
      {...props}
      dialogTitle="Cancel deployment?"
      handleCancel={handleCancel}
      open={open}
      confirmButtonTitle="Yes, cancel deployment"
      handleConfirm={handleConfirm}
      confirmButtonProps={{ variant: 'danger' }}
    >
      <p className="text-sm text-elements-high-em tracking-[-0.006em]">
        This will halt the deployment and you&apos;ll have to start the process
        from scratch.
      </p>
    </ConfirmDialog>
  );
};
