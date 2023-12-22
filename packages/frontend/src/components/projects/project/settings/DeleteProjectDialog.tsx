import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Typography,
} from '@material-tailwind/react';

import { ProjectDetails } from '../../../../types/project';

interface DeleteProjectDialogProp {
  open: boolean;
  handleOpen: () => void;
  project: Partial<ProjectDetails>;
}

const DeleteProjectDialog = ({
  open,
  handleOpen,
  project,
}: DeleteProjectDialogProp) => {
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { isValid },
  } = useForm({
    defaultValues: {
      projectName: '',
    },
  });

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
      <form
        onSubmit={handleSubmit(() => {
          handleOpen();
          navigate('/');
        })}
      >
        <DialogBody className="flex flex-col gap-2">
          <Typography variant="paragraph">
            Deleting your project is irreversible. Enter your project’s name
            &nbsp;
            <span className="bg-blue-100 text-blue-700">({project.name})</span>
            &nbsp;below to confirm you want to permanently delete it:
          </Typography>
          <Input
            id="input"
            crossOrigin={undefined}
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
