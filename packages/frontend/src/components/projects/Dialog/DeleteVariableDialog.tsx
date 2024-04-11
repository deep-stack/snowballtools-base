import ConfirmDialog, {
  ConfirmDialogProps,
} from 'components/shared/ConfirmDialog';

interface DeleteVariableDialogProps extends ConfirmDialogProps {
  variableKey: string;
}

export const DeleteVariableDialog = ({
  variableKey,
  open,
  handleCancel,
  handleConfirm,
  ...props
}: DeleteVariableDialogProps) => {
  return (
    <ConfirmDialog
      {...props}
      dialogTitle="Delete variable"
      handleCancel={handleCancel}
      open={open}
      confirmButtonTitle="Yes, confirm delete"
      handleConfirm={handleConfirm}
      confirmButtonProps={{ variant: 'danger' }}
    >
      <p className="text-sm text-elements-mid-em">
        Are you sure you want to delete the variable{' '}
        <span className="text-sm font-mono text-elements-on-secondary bg-controls-secondary rounded px-0.5">
          {variableKey}
        </span>
        ?
      </p>
    </ConfirmDialog>
  );
};
