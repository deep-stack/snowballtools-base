import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { EnvironmentVariable } from 'gql-client';

import { IconButton, Input, Typography } from '@material-tailwind/react';

import ConfirmDialog from '../../../shared/ConfirmDialog';
import { useGQLClient } from '../../../../context/GQLClientContext';

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
          <Typography variant="small" placeholder={''}>
            Key
          </Typography>
          <Input
            crossOrigin={undefined}
            disabled={!edit}
            {...register(`key`)}
          />
        </div>
        <div>
          <Typography variant="small" placeholder={''}>
            Value
          </Typography>
          <Input
            crossOrigin={undefined}
            disabled={!edit}
            type={showPassword ? 'text' : 'password'}
            icon={
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
                placeholder={''}
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
                placeholder={''}
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
                placeholder={''}
              >
                {'E'}
              </IconButton>
            </div>
            <div className="self-end">
              <IconButton
                size="sm"
                onClick={() => setDeleteDialogOpen((preVal) => !preVal)}
                placeholder={''}
              >
                {'D'}
              </IconButton>
            </div>
          </>
        )}
      </div>

      <ConfirmDialog
        dialogTitle="Delete variable"
        handleOpen={() => setDeleteDialogOpen((preVal) => !preVal)}
        open={deleteDialogOpen}
        confirmButtonTitle="Yes, Confirm delete"
        handleConfirm={removeEnvironmentVariableHandler}
        color="red"
      >
        <Typography variant="small" placeholder={''}>
          Are you sure you want to delete the variable&nbsp;
          <span className="bg-blue-100">{variable.key}</span>?
        </Typography>
      </ConfirmDialog>
    </>
  );
};

export default EditEnvironmentVariableRow;
