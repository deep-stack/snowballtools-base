import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { useGQLClient } from 'context/GQLClientContext';
import { useToast } from 'components/shared/Toast';
import { Modal } from 'components/shared/Modal';
import { Button } from 'components/shared/Button';
import { Input } from 'components/shared/Input';
import { Project } from 'gql-client';

interface DeleteProjectDialogProp {
  open: boolean;
  handleOpen: () => void;
  project: Project;
}

const DeleteProjectDialog = ({
  open,
  handleOpen,
  project,
}: DeleteProjectDialogProp) => {
  const { toast, dismiss } = useToast();
  const { orgSlug } = useParams();
  const navigate = useNavigate();
  const client = useGQLClient();

  const {
    handleSubmit,
    register,
    formState: { isValid },
  } = useForm({
    defaultValues: {
      projectName: '',
    },
  });

  const deleteProjectHandler = useCallback(async () => {
    const { deleteProject } = await client.deleteProject(project.id);

    if (deleteProject) {
      navigate(`/${orgSlug}`);
    } else {
      toast({
        id: 'project_not_deleted',
        title: 'Project not deleted',
        variant: 'error',
        onDismiss: dismiss,
      });
    }

    handleOpen();
  }, [client, project, handleOpen]);

  return (
    <Modal open={open} onOpenChange={handleOpen}>
      <Modal.Content>
        <Modal.Header>Delete project?</Modal.Header>
        <form onSubmit={handleSubmit(deleteProjectHandler)}>
          <Modal.Body>
            <Input
              label={
                "Deleting your project is irreversible. Enter your project's name " +
                project.name +
                ' below to confirm you want to permanently delete it:'
              }
              id="input"
              {...register('projectName', {
                required: 'Project name is required',
                validate: (value) => value === project.name,
              })}
              helperText="Deleting your project is irreversible."
            />
          </Modal.Body>
          <Modal.Footer className="flex justify-start">
            <Button onClick={handleOpen} variant="tertiary">
              Cancel
            </Button>
            <Button variant="danger" type="submit" disabled={!isValid}>
              Yes, delete project
            </Button>
          </Modal.Footer>
        </form>
      </Modal.Content>
    </Modal>
  );
};

export default DeleteProjectDialog;
