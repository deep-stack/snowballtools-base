import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';

import {
  Button,
  Typography,
  Input,
  Select,
  Option,
} from '@material-tailwind/react';

import DeleteProjectDialog from './DeleteProjectDialog';
import ConfirmDialog from '../../../shared/ConfirmDialog';

const PROJECT_ID = '62f87575-7a2b-4951-8156-9f9821j380d';
const TEAMS = ['Airfoil'];
const DEFAULT_SELECT_TEAM = undefined;

const CopyIcon = ({ value }: { value: string }) => {
  return (
    <span
      onClick={() => {
        navigator.clipboard.writeText(value);
        toast.success('Project ID copied');
      }}
      className="cursor-pointer"
    >
      ^
    </span>
  );
};

const GeneralTabPanel = () => {
  const {
    handleSubmit: handleTransfer,
    control,
    formState,
  } = useForm({
    defaultValues: {
      team: DEFAULT_SELECT_TEAM,
    },
  });

  const [openTransferDialog, setOpenTransferDialog] = useState(false);
  const handleTransferProjectDialog = () =>
    setOpenTransferDialog(!openTransferDialog);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const handleDeleteProjectDialog = () =>
    setOpenDeleteDialog(!openDeleteDialog);

  const { handleSubmit, register } = useForm({
    defaultValues: {
      appName: 'iglootools',
      description: '',
    },
  });

  return (
    <>
      <form onSubmit={handleSubmit(() => {})}>
        <Typography variant="h6">Project info</Typography>
        <Typography variant="small" className="font-medium text-gray-800">
          App name
        </Typography>
        <Input
          id="input"
          variant="outlined"
          // TODO: Debug issue: https://github.com/creativetimofficial/material-tailwind/issues/427
          crossOrigin={undefined}
          size="md"
          {...register('appName')}
        />
        <Typography variant="small" className="font-medium text-gray-800">
          Description (Optional)
        </Typography>
        <Input
          id="input"
          variant="outlined"
          crossOrigin={undefined}
          size="md"
          {...register('description')}
        />
        <Typography variant="small" className="font-medium text-gray-800">
          Project ID
        </Typography>
        <Input
          id="input"
          crossOrigin={undefined}
          variant="outlined"
          value={PROJECT_ID}
          size="md"
          disabled
          icon={<CopyIcon value={PROJECT_ID} />}
        />
        <Button type="submit" variant="gradient" size="sm" className="mt-1">
          Save
        </Button>
      </form>
      <div className="mb-1">
        <Typography variant="h6">Transfer project</Typography>
        <Typography variant="small">
          Transfer this app to your personal account or a team you are a member
          of.
          <Link to="" className="text-blue-500">
            Learn more
          </Link>
        </Typography>
        <form
          onSubmit={handleTransfer(() => {
            handleTransferProjectDialog();
          })}
        >
          <Typography variant="small" className="font-medium text-gray-800">
            Choose team
          </Typography>
          <Controller
            name="team"
            rules={{ required: 'This field is required' }}
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                // TODO: Implement placeholder for select
                label={!field.value ? 'Select an account / team' : ''}
              >
                {TEAMS.map((team, key) => (
                  <Option key={key} value={team}>
                    ^ {team}
                  </Option>
                ))}
              </Select>
            )}
          />
          <Button
            variant="gradient"
            size="sm"
            className="mt-1"
            disabled={!formState.isValid}
            type="submit"
          >
            Transfer
          </Button>
        </form>
        <ConfirmDialog
          dialogTitle="Transfer project"
          handleOpen={handleTransferProjectDialog}
          open={openTransferDialog}
          confirmButtonTitle="Yes, Confirm transfer"
          handleConfirm={handleTransferProjectDialog}
          color="blue"
        >
          <Typography variant="small">
            Upon confirmation, your project nextjs-boilerplate will be
            transferred from saugat to Airfoil.
          </Typography>
        </ConfirmDialog>
      </div>
      <div className="mb-1">
        <Typography variant="h6">Delete project</Typography>
        <Typography variant="small">
          The project will be permanently deleted, including its deployments and
          domains. This action is irreversible and can not be undone.
        </Typography>
        <Button
          variant="gradient"
          size="sm"
          color="red"
          onClick={handleDeleteProjectDialog}
        >
          ^ Delete project
        </Button>
        <DeleteProjectDialog
          handleOpen={handleDeleteProjectDialog}
          open={openDeleteDialog}
          project={{ name: 'Iglootools' }}
        />
      </div>
      <Toaster />
    </>
  );
};

export default GeneralTabPanel;
