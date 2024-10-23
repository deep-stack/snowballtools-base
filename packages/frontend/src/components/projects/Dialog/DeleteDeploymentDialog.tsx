import ConfirmDialog, {
  ConfirmDialogProps,
} from 'components/shared/ConfirmDialog';

export const DeleteDeploymentDialog = ({
  open,
  handleCancel,
  handleConfirm,
  ...props
}: ConfirmDialogProps) => {
  return (
    <ConfirmDialog
      {...props}
      dialogTitle="Delete deployment?"
      handleCancel={handleCancel}
      open={open}
      confirmButtonTitle="Yes, delete deployment"
      handleConfirm={handleConfirm}
      confirmButtonProps={{ variant: 'danger' }}
    >
      <p className="text-sm text-elements-high-em">
        Once deleted, the deployment will not be accessible.
      </p>
    </ConfirmDialog>
  );
};
