import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {
  Environment,
  Project,
  Domain,
  DeploymentStatus,
  Deployment,
} from 'gql-client';

import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Typography,
  Chip,
  ChipProps,
  Tooltip,
} from '@material-tailwind/react';

import { relativeTimeMs } from '../../../../utils/time';
import ConfirmDialog from '../../../shared/ConfirmDialog';
import DeploymentDialogBodyCard from './DeploymentDialogBodyCard';
import AssignDomainDialog from './AssignDomainDialog';
import { useGQLClient } from '../../../../context/GQLClientContext';
import { SHORT_COMMIT_HASH_LENGTH } from '../../../../constants';
import { formatAddress } from '../../../../utils/format';

interface DeployDetailsCardProps {
  deployment: Deployment;
  currentDeployment: Deployment;
  onUpdate: () => Promise<void>;
  project: Project;
  prodBranchDomains: Domain[];
}

const STATUS_COLORS: { [key in DeploymentStatus]: ChipProps['color'] } = {
  [DeploymentStatus.Building]: 'blue',
  [DeploymentStatus.Ready]: 'green',
  [DeploymentStatus.Error]: 'red',
};

const DeploymentDetailsCard = ({
  deployment,
  currentDeployment,
  onUpdate,
  project,
  prodBranchDomains,
}: DeployDetailsCardProps) => {
  const client = useGQLClient();

  const [changeToProduction, setChangeToProduction] = useState(false);
  const [redeployToProduction, setRedeployToProduction] = useState(false);
  const [rollbackDeployment, setRollbackDeployment] = useState(false);
  const [assignDomainDialog, setAssignDomainDialog] = useState(false);

  const updateDeployment = async () => {
    const isUpdated = await client.updateDeploymentToProd(deployment.id);
    if (isUpdated) {
      await onUpdate();
      toast.success('Deployment changed to production');
    } else {
      toast.error('Unable to change deployment to production');
    }
  };

  const redeployToProd = async () => {
    const isRedeployed = await client.redeployToProd(deployment.id);
    if (isRedeployed) {
      await onUpdate();
      toast.success('Redeployed to production');
    } else {
      toast.error('Unable to redeploy to production');
    }
  };

  const rollbackDeploymentHandler = async () => {
    const isRollbacked = await client.rollbackDeployment(
      project.id,
      deployment.id,
    );
    if (isRollbacked) {
      await onUpdate();
      toast.success('Deployment rolled back');
    } else {
      toast.error('Unable to rollback deployment');
    }
  };

  return (
    <div className="grid grid-cols-8 gap-2 border-b border-gray-300 p-3 my-2">
      <div className="col-span-3">
        <div className="flex">
          {deployment.url && (
            <Typography className=" basis-3/4">{deployment.url}</Typography>
          )}
        </div>
        <Typography color="gray">
          {deployment.environment === Environment.Production
            ? `Production ${deployment.isCurrent ? '(Current)' : ''}`
            : 'Preview'}
        </Typography>
      </div>
      <div className="col-span-1">
        <Chip
          value={deployment.status}
          color={STATUS_COLORS[deployment.status] ?? 'gray'}
          variant="ghost"
          icon={<i>^</i>}
        />
      </div>
      <div className="col-span-2">
        <Typography color="gray">^ {deployment.branch}</Typography>
        <Typography color="gray">
          ^ {deployment.commitHash.substring(0, SHORT_COMMIT_HASH_LENGTH)}{' '}
          {deployment.commitMessage}
        </Typography>
      </div>
      <div className="col-span-2 flex items-center">
        <Typography color="gray" className="grow">
          ^ {relativeTimeMs(deployment.createdAt)} ^{' '}
          <Tooltip content={deployment.createdBy.name}>
            {formatAddress(deployment.createdBy.name ?? '')}
          </Tooltip>
        </Typography>
        <Menu placement="bottom-start">
          <MenuHandler>
            <button className="self-start">...</button>
          </MenuHandler>
          <MenuList>
            <a href={deployment.url} target="_blank" rel="noreferrer">
              <MenuItem disabled={!Boolean(deployment.url)}>^ Visit</MenuItem>
            </a>
            <MenuItem
              onClick={() => setAssignDomainDialog(!assignDomainDialog)}
            >
              ^ Assign domain
            </MenuItem>
            <MenuItem
              onClick={() => setChangeToProduction(!changeToProduction)}
              disabled={!(deployment.environment !== Environment.Production)}
            >
              ^ Change to production
            </MenuItem>
            <hr className="my-3" />
            <MenuItem
              onClick={() => setRedeployToProduction(!redeployToProduction)}
              disabled={
                !(
                  deployment.environment === Environment.Production &&
                  deployment.isCurrent
                )
              }
            >
              ^ Redeploy to production
            </MenuItem>
            <MenuItem
              onClick={() => setRollbackDeployment(!rollbackDeployment)}
              disabled={
                deployment.isCurrent ||
                deployment.environment !== Environment.Production ||
                !Boolean(currentDeployment)
              }
            >
              ^ Rollback to this version
            </MenuItem>
          </MenuList>
        </Menu>
      </div>
      <ConfirmDialog
        dialogTitle="Change to production?"
        handleOpen={() => setChangeToProduction((preVal) => !preVal)}
        open={changeToProduction}
        confirmButtonTitle="Change"
        color="blue"
        handleConfirm={async () => {
          await updateDeployment();
          setChangeToProduction((preVal) => !preVal);
        }}
      >
        <div className="flex flex-col gap-2">
          <Typography variant="small">
            Upon confirmation, this deployment will be changed to production.
          </Typography>
          <DeploymentDialogBodyCard deployment={deployment} />
          <Typography variant="small">
            The new deployment will be associated with these domains:
          </Typography>
          {prodBranchDomains.length > 0 &&
            prodBranchDomains.map((value) => {
              return (
                <Typography variant="small" color="blue" key={value.id}>
                  ^ {value.name}
                </Typography>
              );
            })}
        </div>
      </ConfirmDialog>
      <ConfirmDialog
        dialogTitle="Redeploy to production?"
        handleOpen={() => setRedeployToProduction((preVal) => !preVal)}
        open={redeployToProduction}
        confirmButtonTitle="Redeploy"
        color="blue"
        handleConfirm={async () => {
          await redeployToProd();
          setRedeployToProduction((preVal) => !preVal);
        }}
      >
        <div className="flex flex-col gap-2">
          <Typography variant="small">
            Upon confirmation, new deployment will be created with the same
            source code as current deployment.
          </Typography>
          <DeploymentDialogBodyCard deployment={deployment} />
          <Typography variant="small">
            These domains will point to your new deployment:
          </Typography>
          {deployment.domain?.name && (
            <Typography variant="small" color="blue">
              {deployment.domain?.name}
            </Typography>
          )}
        </div>
      </ConfirmDialog>
      {Boolean(currentDeployment) && (
        <ConfirmDialog
          dialogTitle="Rollback to this deployment?"
          handleOpen={() => setRollbackDeployment((preVal) => !preVal)}
          open={rollbackDeployment}
          confirmButtonTitle="Rollback"
          color="blue"
          handleConfirm={async () => {
            await rollbackDeploymentHandler();
            setRollbackDeployment((preVal) => !preVal);
          }}
        >
          <div className="flex flex-col gap-2">
            <Typography variant="small">
              Upon confirmation, this deployment will replace your current
              deployment
            </Typography>
            <DeploymentDialogBodyCard
              deployment={currentDeployment}
              chip={{
                value: 'Live Deployment',
                color: 'green',
              }}
            />
            <DeploymentDialogBodyCard
              deployment={deployment}
              chip={{
                value: 'New Deployment',
                color: 'orange',
              }}
            />
            <Typography variant="small">
              These domains will point to your new deployment:
            </Typography>
            <Typography variant="small" color="blue">
              ^ {currentDeployment.domain?.name}
            </Typography>
          </div>
        </ConfirmDialog>
      )}
      <AssignDomainDialog
        open={assignDomainDialog}
        handleOpen={() => setAssignDomainDialog(!assignDomainDialog)}
      />
    </div>
  );
};

export default DeploymentDetailsCard;
