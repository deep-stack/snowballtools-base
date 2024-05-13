import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { AddProjectMemberInput, Permission } from 'gql-client';

import { Typography } from '@snowballtools/material-tailwind-react-fork';

import { Button } from 'components/shared/Button';
import { Modal } from 'components/shared/Modal';
import { Input } from 'components/shared/Input';
import { Checkbox } from 'components/shared/Checkbox';

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
    <Modal open={open} onOpenChange={handleOpen}>
      <Modal.Content>
        <Modal.Header>Add member</Modal.Header>
        <form onSubmit={handleSubmit(submitHandler)}>
          <Modal.Body className="flex flex-col gap-2 p-4">
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
          </Modal.Body>
          <Modal.Footer className="flex justify-start">
            <Button onClick={handleOpen} variant="secondary">
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid}>
              Send invite
            </Button>
          </Modal.Footer>
        </form>
      </Modal.Content>
    </Modal>
  );
};

export default AddMemberDialog;
