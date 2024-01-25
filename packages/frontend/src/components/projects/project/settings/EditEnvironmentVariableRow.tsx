import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { EnvironmentVariable } from 'gql-client';

import { IconButton, Input, Typography } from '@material-tailwind/react';

import ConfirmDialog from '../../../shared/ConfirmDialog';

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
}: {
  variable: EnvironmentVariable;
}) => {
  const { handleSubmit, register, reset } = useForm({
    defaultValues: {
      key: variable.key,
      value: variable.value,
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [edit, setEdit] = useState(false);

  return (
    <>
      <div className="flex gap-1 p-2">
        <div>
          <Typography variant="small">Key</Typography>
          <Input
            crossOrigin={undefined}
            disabled={!edit}
            {...register(`key`)}
          />
        </div>
        <div>
          <Typography variant="small">Value</Typography>
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
                onClick={handleSubmit(() => {
                  toast.success('Variable edited');
                  setEdit((preVal) => !preVal);
                })}
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

      <ConfirmDialog
        dialogTitle="Delete variable"
        handleOpen={() => setDeleteDialogOpen((preVal) => !preVal)}
        open={deleteDialogOpen}
        confirmButtonTitle="Yes, Confirm delete"
        handleConfirm={() => {
          setDeleteDialogOpen((preVal) => !preVal);
          toast.success('Variable deleted');
        }}
        color="red"
      >
        <Typography variant="small">
          Are you sure you want to delete the variable&nbsp;
          <span className="bg-blue-100">{variable.key}</span>?
        </Typography>
      </ConfirmDialog>
    </>
  );
};

export default EditEnvironmentVariableRow;
