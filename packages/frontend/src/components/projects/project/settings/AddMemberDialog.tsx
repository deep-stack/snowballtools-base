import { useCallback } from 'react';
import { useForm } from 'react-hook-form';

import { Typography } from '@snowballtools/material-tailwind-react-fork';

import { Button } from 'components/shared/Button';
import { Modal } from 'components/shared/Modal';
import { Input } from 'components/shared/Input';
import { Select, SelectOption } from 'components/shared/Select';
import { AddProjectMemberInput, Permission } from 'gql-client';

interface AddMemberDialogProp {
  open: boolean;
  handleOpen: () => void;
  handleAddMember: (data: AddProjectMemberInput) => Promise<void>;
}

interface formData {
  emailAddress: string;
  canEdit: boolean;
}

const permissionViewOptions: SelectOption = {
  value: Permission.View,
  label: Permission.View,
};
const permissionEditOptions: SelectOption = {
  value: Permission.Edit,
  label: Permission.Edit,
};
const permissionsDropdownOptions: SelectOption[] = [
  permissionViewOptions,
  permissionEditOptions,
];

const AddMemberDialog = ({
  open,
  handleOpen,
  handleAddMember,
}: AddMemberDialogProp) => {
  const {
    watch,
    setValue,
    handleSubmit,
    register,
    reset,
    formState: { isValid },
  } = useForm({
    defaultValues: {
      emailAddress: '',
      canEdit: false,
    },
  });

  const submitHandler = useCallback(async (data: formData) => {
    reset();
    handleOpen();

    const permissions = [data.canEdit ? Permission.Edit : Permission.View];

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
            <Select
              label="Permissions"
              description="You can change this later if required."
              options={permissionsDropdownOptions}
              value={
                watch('canEdit') ? permissionEditOptions : permissionViewOptions
              }
              onChange={(value) =>
                setValue(
                  'canEdit',
                  (value as SelectOption)!.value === Permission.Edit,
                )
              }
            />
          </Modal.Body>
          <Modal.Footer>
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
