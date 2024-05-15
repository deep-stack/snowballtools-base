import { useState, useEffect, useCallback, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import DeleteProjectDialog from 'components/projects/project/settings/DeleteProjectDialog';
import { useGQLClient } from 'context/GQLClientContext';
import { OutletContextType } from '../../../../../types';
import { TransferProjectDialog } from 'components/projects/Dialog/TransferProjectDialog';
import { Input } from 'components/shared/Input';
import { Heading } from 'components/shared/Heading';
import { Button } from 'components/shared/Button';
import { Select, SelectOption } from 'components/shared/Select';
import { TrashIcon, CopyUnfilledIcon } from 'components/shared/CustomIcon';
import { useToast } from 'components/shared/Toast';
import { ProjectSettingContainer } from 'components/projects/project/settings/ProjectSettingContainer';

const GeneralTabPanel = () => {
  const client = useGQLClient();
  const { toast } = useToast();
  const { project, onUpdate } = useOutletContext<OutletContextType>();

  const [transferOrganizations, setTransferOrganizations] = useState<
    SelectOption[]
  >([]);
  const [selectedTransferOrganization, setSelectedTransferOrganization] =
    useState<SelectOption>();

  const { handleSubmit: handleTransfer, reset: transferFormReset } = useForm({
    defaultValues: {
      org: {
        value: '',
        label: '',
      },
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
    const selectableOrgs: SelectOption[] = orgsToTransfer.map((org) => ({
      value: org.id,
      label: org.name,
    }));

    setTransferOrganizations(selectableOrgs);
  }, [project]);

  const handleTransferProject = useCallback(async () => {
    const { updateProject: isTransferred } = await client.updateProject(
      project.id,
      {
        organizationId: selectedTransferOrganization?.value,
      },
    );
    setOpenTransferDialog(!openTransferDialog);

    if (isTransferred) {
      toast({
        id: 'project_transferred',
        title: 'Project transferred successfully',
        variant: 'success',
        onDismiss() {},
      });
      await fetchUserOrganizations();
      await onUpdate();
      transferFormReset();
    } else {
      toast({
        id: 'project_transfer_failed',
        title: 'Project transfer failed',
        variant: 'error',
        onDismiss() {},
      });
    }
  }, [project, selectedTransferOrganization]);

  const selectedUserOrgName = useMemo(() => {
    return (
      transferOrganizations.find((org) => org === selectedTransferOrganization)
        ?.label || ''
    );
  }, [transferOrganizations, selectedTransferOrganization]);

  useEffect(() => {
    fetchUserOrganizations();
  }, [project]);

  useEffect(() => {
    reset({ appName: project.name, description: project.description });
  }, [project]);

  return (
    <ProjectSettingContainer headingText="Project Info">
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
        className="self-stretch space-y-3"
      >
        <Input
          // TODO: Debug issue: https://github.com/creativetimofficial/material-tailwind/issues/427
          label="App name"
          size="md"
          {...register('appName')}
        />
        <Input
          size="md"
          label="Description (Optional)"
          {...register('description')}
        />
        <div
          onClick={() => {
            navigator.clipboard.writeText(project.id);
            toast({
              id: 'copied_project_id',
              title: 'Project ID copied to clipboard',
              variant: 'success',
              onDismiss() {},
            });
          }}
        >
          <Input
            value={project.id}
            size="md"
            disabled
            label="Project ID"
            rightIcon={<CopyUnfilledIcon />}
          />
        </div>
        <Button
          type="submit"
          size="md"
          disabled={!updateProjectFormState.isDirty}
        >
          Save
        </Button>
      </form>
      <form
        onSubmit={handleTransfer((org) => {
          setSelectedTransferOrganization(org.org);
          setOpenTransferDialog(!openTransferDialog);
        })}
        className="self-stretch space-y-3 px-2"
      >
        <Heading className="text-sky-950 text-lg font-medium leading-normal">
          Transfer project
        </Heading>
        <p className="text-slate-600 text-sm font-normal leading-tight">
          Transfer this app to your personal account or a team you are a member
          of.
        </p>
        <Select
          disabled
          size="md"
          placeholder="Select an account / team"
          options={transferOrganizations}
          value={selectedTransferOrganization}
          onChange={(value) =>
            setSelectedTransferOrganization(value as SelectOption)
          }
        />
        <Button disabled type="submit" size="md">
          Transfer
        </Button>
      </form>
      <TransferProjectDialog
        handleCancel={() => setOpenTransferDialog(!openTransferDialog)}
        open={openTransferDialog}
        handleConfirm={handleTransferProject}
        projectName={project.name}
        from={project.organization.name}
        to={selectedUserOrgName}
      />
      <div className="self-stretch space-y-3 px-2">
        <Heading className="text-sky-950 text-lg font-medium leading-normal">
          Delete project
        </Heading>
        <p className="text-slate-600 text-sm font-normal leading-tight">
          The project will be permanently deleted, including its deployments and
          domains. This action is irreversible and can not be undone.
        </p>
        <Button
          size="md"
          variant="danger"
          onClick={handleDeleteProjectDialog}
          leftIcon={<TrashIcon />}
        >
          Delete project
        </Button>
        <DeleteProjectDialog
          handleOpen={handleDeleteProjectDialog}
          open={openDeleteDialog}
          project={project}
        />
      </div>
    </ProjectSettingContainer>
  );
};

export default GeneralTabPanel;
