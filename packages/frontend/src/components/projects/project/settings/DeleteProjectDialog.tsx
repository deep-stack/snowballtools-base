import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Project } from 'gql-client';

import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Typography,
} from '@snowballtools/material-tailwind-react-fork';
import { useGQLClient } from '../../../../context/GQLClientContext';

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
      toast.error('Project not deleted');
    }

    handleOpen();
  }, [client, project, handleOpen]);

  return (
    <Dialog open={open} handler={handleOpen}>
      <DialogHeader className="flex justify-between">
        <div>Delete project?</div>
        <Button
          variant="outlined"
          onClick={handleOpen}
          className="mr-1 rounded-3xl"
        >
          X
        </Button>
      </DialogHeader>
      <form onSubmit={handleSubmit(deleteProjectHandler)}>
        <DialogBody className="flex flex-col gap-2">
          <Typography variant="paragraph">
            Deleting your project is irreversible. Enter your project’s
            name&nbsp;
            <span className="bg-blue-100 text-blue-700">({project.name})</span>
            &nbsp;below to confirm you want to permanently delete it:
          </Typography>
          <Input
            id="input"
            {...register('projectName', {
              required: 'Project name is required',
              validate: (value) => value === project.name,
            })}
          />
          <Typography variant="small" color="red">
            ^ Deleting your project is irreversible.
          </Typography>
        </DialogBody>
        <DialogFooter className="flex justify-start">
          <Button variant="outlined" onClick={handleOpen} className="mr-1">
            Cancel
          </Button>
          <Button
            variant="gradient"
            color="red"
            type="submit"
            disabled={!isValid}
          >
            Yes, Delete project
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
};

export default DeleteProjectDialog;
