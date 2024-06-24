import { useState } from 'react';
import { Domain, DomainStatus, Project } from 'gql-client';

import {
  Typography,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Card,
} from '@snowballtools/material-tailwind-react-fork';

import EditDomainDialog from './EditDomainDialog';
import { useGQLClient } from 'context/GQLClientContext';
import { DeleteDomainDialog } from 'components/projects/Dialog/DeleteDomainDialog';
import { useToast } from 'components/shared/Toast';
import { Tag } from 'components/shared/Tag';
import {
  CheckIcon,
  CrossIcon,
  GearIcon,
  LoadingIcon,
} from 'components/shared/CustomIcon';
import { Heading } from 'components/shared/Heading';
import { Button } from 'components/shared/Button';

enum RefreshStatus {
  IDLE,
  CHECKING,
  CHECK_SUCCESS,
  CHECK_FAIL,
}

interface DomainCardProps {
  domains: Domain[];
  domain: Domain;
  branches: string[];
  project: Project;
  onUpdate: () => Promise<void>;
}

const CHECK_FAIL_TIMEOUT = 5000; // In milliseconds

// TODO: Get domain record
const DOMAIN_RECORD = {
  type: 'A',
  name: '@',
  value: '56.49.19.21',
};

const DomainCard = ({
  domains,
  domain,
  branches,
  project,
  onUpdate,
}: DomainCardProps) => {
  const { toast, dismiss } = useToast();
  const [refreshStatus, SetRefreshStatus] = useState(RefreshStatus.IDLE);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const client = useGQLClient();

  const deleteDomain = async () => {
    const { deleteDomain } = await client.deleteDomain(domain.id);

    if (deleteDomain) {
      onUpdate();
      toast({
        id: 'domain_deleted_success',
        title: 'Domain deleted',
        variant: 'success',
        onDismiss: dismiss,
      });
    } else {
      toast({
        id: 'domain_deleted_error',
        title: `Error deleting domain ${domain.name}`,
        variant: 'error',
        onDismiss: dismiss,
      });
    }
  };

  return (
    <>
      <div className="flex justify-between py-3">
        <div className="flex justify-start gap-1">
          <Heading as="h6" className="flex-col">
            {domain.name}{' '}
            <Tag
              type={
                domain.status === DomainStatus.Live ? 'positive' : 'negative'
              }
              leftIcon={
                domain.status === DomainStatus.Live ? (
                  <CheckIcon />
                ) : (
                  <CrossIcon />
                )
              }
            >
              {domain.status}
            </Tag>
          </Heading>
        </div>

        <div className="flex justify-start gap-1">
          <i
            id="refresh"
            className="cursor-pointer"
            onClick={() => {
              SetRefreshStatus(RefreshStatus.CHECKING);
              setTimeout(() => {
                SetRefreshStatus(RefreshStatus.CHECK_FAIL);
              }, CHECK_FAIL_TIMEOUT);
            }}
          >
            {refreshStatus === RefreshStatus.CHECKING ? (
              <LoadingIcon className="animate-spin" />
            ) : (
              'L'
            )}
          </i>
          <Menu placement="bottom-end">
            <MenuHandler>
              <Button iconOnly>
                <GearIcon />
              </Button>
            </MenuHandler>
            <MenuList>
              <MenuItem
                className="text-black"
                onClick={() => {
                  setEditDialogOpen((preVal) => !preVal);
                }}
              >
                Edit Domain
              </MenuItem>
              <MenuItem
                className="text-red-500"
                onClick={() => setDeleteDialogOpen((preVal) => !preVal)}
              >
                Delete domain
              </MenuItem>
            </MenuList>
          </Menu>
        </div>

        <DeleteDomainDialog
          handleCancel={() => setDeleteDialogOpen((preVal) => !preVal)}
          open={deleteDialogOpen}
          handleConfirm={() => {
            deleteDomain();
            setDeleteDialogOpen((preVal) => !preVal);
          }}
          projectName={project.name}
          domainName={domain.name}
        />
      </div>

      <Typography variant="small">Production</Typography>
      {domain.status === DomainStatus.Pending && (
        <Card className="bg-slate-100 p-4 text-sm">
          {refreshStatus === RefreshStatus.IDLE ? (
            <Heading>
              ^ Add these records to your domain and refresh to check
            </Heading>
          ) : refreshStatus === RefreshStatus.CHECKING ? (
            <Heading className="text-blue-500">
              ^ Checking records for {domain.name}
            </Heading>
          ) : (
            <div className="flex gap-2 text-red-500 mb-2">
              <div className="grow">
                Failed to verify records. DNS propagation can take up to 48
                hours. Please ensure you added the correct records and refresh.
              </div>
            </div>
          )}

          <table>
            <thead>
              <tr>
                <th className="text-left">Type</th>
                <th className="text-left">Name</th>
                <th className="text-left">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{DOMAIN_RECORD.type}</td>
                <td>{DOMAIN_RECORD.name}</td>
                <td>{DOMAIN_RECORD.value}</td>
              </tr>
            </tbody>
          </table>
        </Card>
      )}

      <EditDomainDialog
        handleOpen={() => {
          setEditDialogOpen((preVal) => !preVal);
        }}
        domains={domains}
        open={editDialogOpen}
        domain={domain}
        branches={branches}
        onUpdate={onUpdate}
      />
    </>
  );
};

export default DomainCard;
