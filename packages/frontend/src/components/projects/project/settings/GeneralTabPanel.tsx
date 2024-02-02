import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Organization, Project } from 'gql-client';

import { Button, Typography, Input, Option } from '@material-tailwind/react';

import DeleteProjectDialog from './DeleteProjectDialog';
import ConfirmDialog from '../../../shared/ConfirmDialog';
import { useGQLClient } from '../../../../context/GQLClientContext';
import AsyncSelect from '../../../shared/AsyncSelect';

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

const GeneralTabPanel = ({
  project,
  onUpdate,
}: {
  project: Project;
  onUpdate: () => Promise<void>;
}) => {
  const client = useGQLClient();
  const [transferOrganizations, setTransferOrganizations] = useState<
    Organization[]
  >([]);
  const [selectedTransferOrganization, setSelectedTransferOrganization] =
    useState('');

  const {
    handleSubmit: handleTransfer,
    control,
    formState,
    reset: transferFormReset,
  } = useForm({
    defaultValues: {
      orgId: '',
    },
  });

  const [openTransferDialog, setOpenTransferDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleDeleteProjectDialog = () =>
    setOpenDeleteDialog(!openDeleteDialog);

  const {
    handleSubmit,
    register,
    reset,
    formState: updateProjectFormState,
  } = useForm({
    defaultValues: {
      appName: project.name,
      description: project.description,
    },
  });

  const fetchUserOrganizations = useCallback(async () => {
    const { organizations } = await client.getOrganizations();
    const orgsToTransfer = organizations.filter(
      (org) => org.id !== project.organization.id,
    );
    setTransferOrganizations(orgsToTransfer);
  }, [project]);

  const handleTransferProject = useCallback(async () => {
    const { updateProject: isTransferred } = await client.updateProject(
      project.id,
      {
        organizationId: selectedTransferOrganization,
      },
    );
    setOpenTransferDialog(!openTransferDialog);

    if (isTransferred) {
      toast.success('Project transferred');
      await fetchUserOrganizations();
      await onUpdate();
      transferFormReset();
    } else {
      toast.error('Project not transrfered');
    }
  }, [project, selectedTransferOrganization]);

  const selectedUserOrgName = useMemo(() => {
    return (
      transferOrganizations.find(
        (org) => org.id === selectedTransferOrganization,
      )?.name || ''
    );
  }, [transferOrganizations, selectedTransferOrganization]);

  useEffect(() => {
    fetchUserOrganizations();
  }, [project]);

  useEffect(() => {
    reset({ appName: project.name, description: project.description });
  }, [project]);

  return (
    <>
      <form
        onSubmit={handleSubmit(async ({ appName, description }) => {
          const { updateProject } = await client.updateProject(project.id, {
            name: appName,
            description,
          });
          if (updateProject) {
            await onUpdate();
          }
        })}
      >
        <Typography variant="h6">Project info</Typography>
        <Typography variant="small" className="font-medium text-gray-800">
          App name
        </Typography>
        <Input
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
          variant="outlined"
          crossOrigin={undefined}
          size="md"
          {...register('description')}
        />
        <Typography variant="small" className="font-medium text-gray-800">
          Project ID
        </Typography>
        <Input
          crossOrigin={undefined}
          variant="outlined"
          value={project.id}
          size="md"
          disabled
          icon={<CopyIcon value={project.id} />}
        />
        <Button
          type="submit"
          variant="gradient"
          size="sm"
          className="mt-1"
          disabled={!updateProjectFormState.isDirty}
        >
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
          onSubmit={handleTransfer(({ orgId }) => {
            setSelectedTransferOrganization(orgId);
            setOpenTransferDialog(!openTransferDialog);
          })}
        >
          <Typography variant="small" className="font-medium text-gray-800">
            Choose team
          </Typography>
          <Controller
            name="orgId"
            rules={{ required: 'This field is required' }}
            control={control}
            render={({ field }) => (
              <AsyncSelect
                {...field}
                // TODO: Implement placeholder for select
                label={!field.value ? 'Select an account / team' : ''}
              >
                {transferOrganizations.map((org, key) => (
                  <Option key={key} value={org.id}>
                    ^ {org.name}
                  </Option>
                ))}
              </AsyncSelect>
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
          handleOpen={() => setOpenTransferDialog(!openTransferDialog)}
          open={openTransferDialog}
          confirmButtonTitle="Yes, Confirm transfer"
          handleConfirm={handleTransferProject}
          color="blue"
        >
          <Typography variant="small">
            Upon confirmation, your project {project.name} will be transferred
            from {project.organization.name} to {selectedUserOrgName}.
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
          project={project}
        />
      </div>
    </>
  );
};

export default GeneralTabPanel;
