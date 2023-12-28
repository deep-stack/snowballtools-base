import React, { useState } from 'react';

import toast from 'react-hot-toast';
import {
  Chip,
  Typography,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Card,
} from '@material-tailwind/react';

import { DomainDetails, DomainStatus } from '../../../../types/project';
import ConfirmDialog from '../../../shared/ConfirmDialog';
import projectData from '../../../../assets/projects.json';
import EditDomainDialog from './EditDomainDialog';

enum RefreshStatus {
  IDLE,
  CHECKING,
  CHECK_SUCCESS,
  CHECK_FAIL,
}

interface DomainCardProps {
  domain: DomainDetails;
}

const CHECK_FAIL_TIMEOUT = 5000; // In milliseconds

const DomainCard = ({ domain }: DomainCardProps) => {
  const [refreshStatus, SetRefreshStatus] = useState(RefreshStatus.IDLE);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [openEditDomainDialog, SetOpenEditDomainDialog] = useState(false);

  const currProject = projectData.filter(
    (data) => data.id === domain.projectid,
  );

  return (
    <>
      <div className="flex justify-between py-3">
        <div className="flex justify-start gap-1">
          <Typography variant="h6">
            <i>^</i> {domain.name}
          </Typography>
          <Chip
            className="w-fit capitalize"
            value={domain.status}
            color={domain.status === DomainStatus.LIVE ? 'green' : 'orange'}
            variant="ghost"
            icon={<i>^</i>}
          />
        </div>

        <div className="flex justify-start gap-1">
          <i
            id="refresh"
            className="cursor-pointer w-8 h-8"
            onClick={() => {
              SetRefreshStatus(RefreshStatus.CHECKING);
              setTimeout(() => {
                SetRefreshStatus(RefreshStatus.CHECK_FAIL);
              }, CHECK_FAIL_TIMEOUT);
            }}
          >
            {refreshStatus === RefreshStatus.CHECKING ? 'L' : 'R'}
          </i>
          <Menu placement="bottom-end">
            <MenuHandler>
              <button className="border-2 rounded-full w-8 h-8">...</button>
            </MenuHandler>
            <MenuList>
              <MenuItem
                className="text-black"
                onClick={() => {
                  SetOpenEditDomainDialog((preVal) => !preVal);
                }}
              >
                ^ Edit domain
              </MenuItem>
              <MenuItem
                className="text-red-500"
                onClick={() => setDeleteDialogOpen(true)}
              >
                ^ Delete domain
              </MenuItem>
            </MenuList>
          </Menu>
        </div>

        <ConfirmDialog
          dialogTitle="Delete domain?"
          handleOpen={() => setDeleteDialogOpen((preVal) => !preVal)}
          open={deleteDialogOpen}
          confirmButtonTitle="Yes, Delete domain"
          handleConfirm={() => {
            setDeleteDialogOpen((preVal) => !preVal);
            toast.success(`Domain "${domain.name}" has been deleted`);
          }}
          color="red"
        >
          <Typography variant="small">
            Once deleted, the project{' '}
            <span className="bg-blue-100 rounded-sm p-0.5 text-blue-700">
              {currProject[0].title}
            </span>{' '}
            will not be accessible from the domain{' '}
            <span className="bg-blue-100 rounded-sm p-0.5 text-blue-700">
              {domain.name}.
            </span>
          </Typography>
        </ConfirmDialog>
      </div>

      <Typography variant="small">Production</Typography>
      {domain.status === DomainStatus.PENDING && (
        <Card className="bg-gray-200 p-4 text-sm">
          {refreshStatus === RefreshStatus.IDLE ? (
            <Typography variant="small">
              ^ Add these records to your domain and refresh to check
            </Typography>
          ) : refreshStatus === RefreshStatus.CHECKING ? (
            <Typography variant="small" className="text-blue-500">
              ^ Checking records for {domain.name}
            </Typography>
          ) : (
            <div className="flex gap-2 text-red-500 mb-2">
              <div>^</div>
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
                <td>{domain.record.type}</td>
                <td>{domain.record.name}</td>
                <td>{domain.record.value}</td>
              </tr>
            </tbody>
          </table>
        </Card>
      )}
      <EditDomainDialog
        handleOpen={() => {
          SetOpenEditDomainDialog((preVal) => !preVal);
        }}
        open={openEditDomainDialog}
        domain={domain}
      />
    </>
  );
};

export default DomainCard;
