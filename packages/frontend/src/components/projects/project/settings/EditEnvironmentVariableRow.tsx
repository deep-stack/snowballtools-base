import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useGQLClient } from 'context/GQLClientContext';
import { DeleteVariableDialog } from 'components/projects/Dialog/DeleteVariableDialog';
import { Input } from 'components/shared/Input';
import { Button } from 'components/shared/Button';
import {
  CheckRoundFilledIcon,
  CrossIcon,
  EditBigIcon,
  HideEyeOffIcon,
  ShowEyeIcon,
  TrashIcon,
} from 'components/shared/CustomIcon';
import { EnvironmentVariable } from 'gql-client';
import { useToast } from 'components/shared/Toast';

const ShowPasswordIcon = ({
  handler,
  isVisible,
}: {
  handler: () => void;
  isVisible: boolean;
}) => {
  return (
    <span
      onClick={() => {
        handler();
      }}
      className="cursor-pointer"
    >
      {isVisible ? <ShowEyeIcon size={16} /> : <HideEyeOffIcon size={16} />}
    </span>
  );
};

export interface EditEnvironmentVariableRowProps {
  variable: EnvironmentVariable;
  onUpdate: () => Promise<void>;
  isFirstVariable?: boolean;
}

const EditEnvironmentVariableRow = ({
  variable,
  onUpdate,
  isFirstVariable = false,
}: EditEnvironmentVariableRowProps) => {
  const client = useGQLClient();
  const { toast, dismiss } = useToast();

  const { handleSubmit, register, reset } = useForm({
    defaultValues: {
      key: variable.key,
      value: variable.value,
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [edit, setEdit] = useState(false);

  const removeEnvironmentVariableHandler = useCallback(async () => {
    const { removeEnvironmentVariable: isEnvironmentVariableRemoved } =
      await client.removeEnvironmentVariable(variable.id);

    if (isEnvironmentVariableRemoved) {
      await onUpdate();
      setDeleteDialogOpen((preVal) => !preVal);
      toast({
        id: 'variable_deleted',
        title: 'Variable deleted',
        variant: 'success',
        onDismiss: dismiss,
      });
    } else {
      toast({
        id: 'variable_not_deleted',
        title: 'Variable not deleted',
        variant: 'error',
        onDismiss: dismiss,
      });
    }
  }, [variable, onUpdate]);

  const updateEnvironmentVariableHandler = useCallback(
    async (data: { key: string; value: string }) => {
      const { updateEnvironmentVariable: isEnvironmentVariableUpdated } =
        await client.updateEnvironmentVariable(variable.id, data);

      if (isEnvironmentVariableUpdated) {
        await onUpdate();
        toast({
          id: 'variable_updated',
          title: 'Variable edited',
          variant: 'success',
          onDismiss: dismiss,
        });

        setEdit((preVal) => !preVal);
      } else {
        toast({
          id: 'variable_not_updated',
          title: 'Variable not edited',
          variant: 'error',
          onDismiss: dismiss,
        });
      }
    },
    [variable, onUpdate],
  );

  useEffect(() => {
    reset({ key: variable.key, value: variable.value });
  }, [variable]);

  return (
    <>
      <div className="flex gap-1 items-end">
        <Input
          disabled={!edit}
          {...register(`key`)}
          label={isFirstVariable ? 'Key' : undefined}
        />
        <Input
          disabled={!edit}
          type={showPassword || edit ? 'text' : 'password'}
          label={isFirstVariable ? 'Value' : undefined}
          rightIcon={
            <ShowPasswordIcon
              handler={() => {
                setShowPassword((prevShowPassword) => !prevShowPassword);
              }}
              isVisible={showPassword || edit}
            />
          }
          {...register(`value`)}
        />
        <Button
          iconOnly
          size="md"
          onClick={() => {
            edit
              ? handleSubmit(updateEnvironmentVariableHandler)()
              : setEdit((preVal) => !preVal);
          }}
        >
          {edit ? (
            <CheckRoundFilledIcon size={16} />
          ) : (
            <EditBigIcon size={16} />
          )}
        </Button>
        <Button
          iconOnly
          size="md"
          onClick={() => {
            if (edit) {
              reset();
              setEdit((preVal) => !preVal);
            } else {
              setDeleteDialogOpen((preVal) => !preVal);
            }
          }}
        >
          {edit ? <CrossIcon size={16} /> : <TrashIcon size={16} />}
        </Button>
      </div>
      <DeleteVariableDialog
        handleCancel={() => setDeleteDialogOpen((preVal) => !preVal)}
        open={deleteDialogOpen}
        handleConfirm={removeEnvironmentVariableHandler}
        variableKey={variable.key}
      />
    </>
  );
};

export default EditEnvironmentVariableRow;
