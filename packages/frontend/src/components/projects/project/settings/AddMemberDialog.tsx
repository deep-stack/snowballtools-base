import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';

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

import { ProjectMember, Permission } from '../../../../types/project';

interface AddMemberDialogProp {
  open: boolean;
  handleOpen: () => void;
  handleAddMember: (projectMember: ProjectMember) => void;
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

  const submitHandler = useCallback((data: formData) => {
    reset();
    handleOpen();

    const projectMember: ProjectMember = {
      id: Math.random().toString(),
      permissions: [],
      member: {
        name: '',
        email: data.emailAddress,
        id: Math.random().toString(),
      },
    };

    handleAddMember(projectMember);
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
            crossOrigin={undefined}
            {...register('emailAddress', {
              required: 'email field cannot be empty',
            })}
          />
          <Typography variant="small">Permissions</Typography>
          <Typography variant="small">
            You can change this later if required.
          </Typography>
          <Checkbox
            crossOrigin={undefined}
            label={Permission.VIEW}
            {...register(`permissions.view`)}
            color="blue"
          />
          <Checkbox
            crossOrigin={undefined}
            label={Permission.EDIT}
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
