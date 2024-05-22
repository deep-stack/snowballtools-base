import ConfirmDialog, {
  ConfirmDialogProps,
} from 'components/shared/ConfirmDialog';

import { formatAddress } from 'utils/format';

interface RemoveMemberDialogProps extends ConfirmDialogProps {
  memberName: string;
  ethAddress: string;
  emailDomain: string;
}

export const RemoveMemberDialog = ({
  memberName,
  ethAddress,
  emailDomain,
  open,
  handleCancel,
  handleConfirm,
  ...props
}: RemoveMemberDialogProps) => {
  return (
    <ConfirmDialog
      {...props}
      dialogTitle="Remove member?"
      handleCancel={handleCancel}
      open={open}
      confirmButtonTitle="Yes, remove member"
      handleConfirm={handleConfirm}
      confirmButtonProps={{ variant: 'danger' }}
    >
      <p className="text-sm text-elements-high-em">
        Once removed, {formatAddress(memberName)} ({formatAddress(ethAddress)}@
        {emailDomain}) will not be able to access this project.
      </p>
    </ConfirmDialog>
  );
};
