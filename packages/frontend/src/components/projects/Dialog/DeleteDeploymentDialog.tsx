import ConfirmDialog, {
  ConfirmDialogProps,
} from 'components/shared/ConfirmDialog';
import { ArrowRightCircleFilledIcon, LoadingIcon } from 'components/shared/CustomIcon';

interface DeleteDeploymentDialogProps extends ConfirmDialogProps {
  isConfirmButtonLoading?: boolean;
}

export const DeleteDeploymentDialog = ({
  open,
  handleCancel,
  handleConfirm,
  isConfirmButtonLoading,
  ...props
}: DeleteDeploymentDialogProps) => {
  return (
    <ConfirmDialog
      {...props}
      dialogTitle="Delete deployment?"
      handleCancel={handleCancel}
      open={open}
      confirmButtonTitle={isConfirmButtonLoading ? "Deleting deployment" : "Yes, delete deployment"}
      handleConfirm={handleConfirm}
      confirmButtonProps={{
        variant: 'danger',
        disabled: isConfirmButtonLoading,
        rightIcon: isConfirmButtonLoading ? (
          <LoadingIcon className="animate-spin" />
        ) : (
          <ArrowRightCircleFilledIcon />
        ),
      }}
    >
      <p className="text-sm text-elements-high-em">
        Once deleted, the deployment will not be accessible.
      </p>
    </ConfirmDialog>
  );
};
