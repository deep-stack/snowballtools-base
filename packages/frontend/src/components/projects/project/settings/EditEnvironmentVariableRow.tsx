import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { EnvironmentVariable } from 'gql-client';

import {
  IconButton,
  Typography,
} from '@snowballtools/material-tailwind-react-fork';

import { useGQLClient } from 'context/GQLClientContext';
import { DeleteVariableDialog } from 'components/projects/Dialog/DeleteVariableDialog';
import { Input } from 'components/shared/Input';

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
      {isVisible ? '-' : '+'}
    </span>
  );
};

const EditEnvironmentVariableRow = ({
  variable,
  onUpdate,
}: {
  variable: EnvironmentVariable;
  onUpdate: () => Promise<void>;
}) => {
  const client = useGQLClient();

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
      toast.success('Variable deleted');
    } else {
      toast.error('Variable not deleted');
    }
  }, [variable, onUpdate]);

  const updateEnvironmentVariableHandler = useCallback(
    async (data: { key: string; value: string }) => {
      const { updateEnvironmentVariable: isEnvironmentVariableUpdated } =
        await client.updateEnvironmentVariable(variable.id, data);

      if (isEnvironmentVariableUpdated) {
        await onUpdate();
        toast.success('Variable edited');
        setEdit((preVal) => !preVal);
      } else {
        toast.error('Variable not edited');
      }
    },
    [variable, onUpdate],
  );

  useEffect(() => {
    reset({ key: variable.key, value: variable.value });
  }, [variable]);

  return (
    <>
      <div className="flex gap-1 p-2">
        <div>
          <Typography variant="small">Key</Typography>
          <Input disabled={!edit} {...register(`key`)} />
        </div>
        <div>
          <Typography variant="small">Value</Typography>
          <Input
            disabled={!edit}
            type={showPassword ? 'text' : 'password'}
            leftIcon={
              <ShowPasswordIcon
                handler={() => {
                  setShowPassword((prevShowPassword) => !prevShowPassword);
                }}
                isVisible={showPassword}
              />
            }
            {...register(`value`)}
          />
        </div>
        {edit ? (
          <>
            <div className="self-end">
              <IconButton
                onClick={handleSubmit(updateEnvironmentVariableHandler)}
                size="sm"
              >
                {'S'}
              </IconButton>
            </div>
            <div className="self-end">
              <IconButton
                size="sm"
                onClick={() => {
                  reset();
                  setEdit((preVal) => !preVal);
                }}
              >
                {'C'}
              </IconButton>
            </div>
          </>
        ) : (
          <>
            <div className="self-end">
              <IconButton
                size="sm"
                onClick={() => {
                  setEdit((preVal) => !preVal);
                }}
              >
                {'E'}
              </IconButton>
            </div>
            <div className="self-end">
              <IconButton
                size="sm"
                onClick={() => setDeleteDialogOpen((preVal) => !preVal)}
              >
                {'D'}
              </IconButton>
            </div>
          </>
        )}
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
