import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { AddProjectMemberInput, Permission } from 'gql-client';

import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Typography,
  Checkbox,
} from '@material-tailwind/react';

interface AddMemberDialogProp {
  open: boolean;
  handleOpen: () => void;
  handleAddMember: (data: AddProjectMemberInput) => Promise<void>;
}

interface formData {
  emailAddress: string;
  permissions: {
    view: boolean;
    edit: boolean;
  };
}

const AddMemberDialog = ({
  open,
  handleOpen,
  handleAddMember,
}: AddMemberDialogProp) => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { isValid },
  } = useForm({
    defaultValues: {
      emailAddress: '',
      permissions: {
        view: true,
        edit: false,
      },
    },
  });

  const submitHandler = useCallback(async (data: formData) => {
    reset();
    handleOpen();

    const permissions = Object.entries(data.permissions)
      .filter(([, value]) => value)
      .map(
        ([key]) => key.charAt(0).toUpperCase() + key.slice(1),
      ) as Permission[];

    await handleAddMember({ email: data.emailAddress, permissions });
  }, []);

  return (
    <Dialog open={open} handler={handleOpen} placeholder={''}>
      <DialogHeader className="flex justify-between" placeholder={''}>
        <div>Add member</div>
        <Button
          variant="outlined"
          onClick={handleOpen}
          className="mr-1 rounded-3xl"
          placeholder={''}
        >
          X
        </Button>
      </DialogHeader>
      <form onSubmit={handleSubmit(submitHandler)}>
        <DialogBody className="flex flex-col gap-2 p-4" placeholder={''}>
          <Typography variant="small" placeholder={''}>
            We will send an invitation link to this email address.
          </Typography>
          <Typography variant="small" placeholder={''}>
            Email address
          </Typography>
          <Input
            type="email"
            crossOrigin={undefined}
            {...register('emailAddress', {
              required: 'email field cannot be empty',
            })}
          />
          <Typography variant="small" placeholder={''}>
            Permissions
          </Typography>
          <Typography variant="small" placeholder={''}>
            You can change this later if required.
          </Typography>
          <Checkbox
            crossOrigin={undefined}
            label={Permission.View}
            {...register(`permissions.view`)}
            color="blue"
          />
          <Checkbox
            crossOrigin={undefined}
            label={Permission.Edit}
            {...register(`permissions.edit`)}
            color="blue"
          />
        </DialogBody>
        <DialogFooter className="flex justify-start" placeholder={''}>
          <Button
            variant="outlined"
            onClick={handleOpen}
            className="mr-1"
            placeholder={''}
          >
            Cancel
          </Button>
          <Button
            variant="gradient"
            color="blue"
            type="submit"
            disabled={!isValid}
            placeholder={''}
          >
            Send invite
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
};

export default AddMemberDialog;
