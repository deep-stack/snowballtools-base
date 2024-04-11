import { useCallback } from 'react';
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
} from '@snowballtools/material-tailwind-react-fork';

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
    <Dialog open={open} handler={handleOpen}>
      <DialogHeader className="flex justify-between">
        <div>Add member</div>
        <Button
          variant="outlined"
          onClick={handleOpen}
          className="mr-1 rounded-3xl"
        >
          X
        </Button>
      </DialogHeader>
      <form onSubmit={handleSubmit(submitHandler)}>
        <DialogBody className="flex flex-col gap-2 p-4">
          <Typography variant="small">
            We will send an invitation link to this email address.
          </Typography>
          <Typography variant="small">Email address</Typography>
          <Input
            type="email"
            {...register('emailAddress', {
              required: 'email field cannot be empty',
            })}
          />
          <Typography variant="small">Permissions</Typography>
          <Typography variant="small">
            You can change this later if required.
          </Typography>
          <Checkbox
            label={Permission.View}
            {...register(`permissions.view`)}
            color="blue"
          />
          <Checkbox
            label={Permission.Edit}
            {...register(`permissions.edit`)}
            color="blue"
          />
        </DialogBody>
        <DialogFooter className="flex justify-start">
          <Button variant="outlined" onClick={handleOpen} className="mr-1">
            Cancel
          </Button>
          <Button
            variant="gradient"
            color="blue"
            type="submit"
            disabled={!isValid}
          >
            Send invite
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
};

export default AddMemberDialog;
