import React, { useState } from 'react';

import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Typography,
  Chip,
  ChipProps,
} from '@material-tailwind/react';
import toast from 'react-hot-toast';
import { Environment } from 'gql-client';

import { relativeTimeMs } from '../../../../utils/time';
import ConfirmDialog from '../../../shared/ConfirmDialog';
import DeploymentDialogBodyCard from './DeploymentDialogBodyCard';
import { DeploymentDetails, Status } from '../../../../types/project';
import { useGQLClient } from '../../../../context/GQLClientContext';

interface DeployDetailsCardProps {
  deployment: DeploymentDetails;
  productionDeployment: DeploymentDetails;
  onUpdate: () => Promise<void>;
  projectId: string;
}

const STATUS_COLORS: { [key in Status]: ChipProps['color'] } = {
  [Status.BUILDING]: 'blue',
  [Status.READY]: 'green',
  [Status.ERROR]: 'red',
};

const DeploymentDetailsCard = ({
  deployment,
  productionDeployment,
  onUpdate,
  projectId,
}: DeployDetailsCardProps) => {
  const client = useGQLClient();

  const [changeToProduction, setChangeToProduction] = useState(false);
  const [redeployToProduction, setRedeployToProduction] = useState(false);
  const [rollbackDeployment, setRollbackDeployment] = useState(false);

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
      projectId,
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
    <div className="grid grid-cols-4 gap-2 border-b border-gray-300 p-3 my-2">
      <div className="col-span-2">
        <div className="flex">
          <Typography className=" basis-3/4">{deployment.title}</Typography>
          <Chip
            value={deployment.status}
            color={STATUS_COLORS[deployment.status] ?? 'gray'}
            variant="ghost"
            icon={<i>^</i>}
          />
        </div>
        <Typography color="gray">
          {deployment.environment === Environment.Production
            ? `Production ${deployment.isCurrent ? '(Current)' : ''}`
            : 'Preview'}
        </Typography>
      </div>
      <div className="col-span-1">
        <Typography color="gray">^ {deployment.branch}</Typography>
        <Typography color="gray">
          ^ {deployment.commitHash} {deployment.commit.message}
        </Typography>
      </div>
      <div className="col-span-1 flex items-center">
        <Typography color="gray" className="grow">
          {relativeTimeMs(deployment.createdAt)} ^ {deployment.author}
        </Typography>
        <Menu placement="bottom-start">
          <MenuHandler>
            <button className="self-start">...</button>
          </MenuHandler>
          <MenuList>
            <MenuItem>^ Visit</MenuItem>
            <MenuItem>^ Assign domain</MenuItem>
            {!(deployment.environment === Environment.Production) && (
              <MenuItem
                onClick={() => setChangeToProduction(!changeToProduction)}
              >
                ^ Change to production
              </MenuItem>
            )}

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
            {deployment.environment === Environment.Production && (
              <MenuItem
                onClick={() => setRollbackDeployment(!rollbackDeployment)}
                disabled={deployment.isCurrent}
              >
                ^ Rollback to this version
              </MenuItem>
            )}
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
          <Typography variant="small" color="blue">
            ^ saugatt.com
          </Typography>
          <Typography variant="small" color="blue">
            ^ www.saugatt.com
          </Typography>
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
          <Typography variant="small" color="blue">
            ^ saugatt.com
          </Typography>
          <Typography variant="small" color="blue">
            ^ www.saugatt.com
          </Typography>
        </div>
      </ConfirmDialog>
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
            deployment={productionDeployment}
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
            ^ saugatt.com
          </Typography>
          <Typography variant="small" color="blue">
            ^ www.saugatt.com
          </Typography>
        </div>
      </ConfirmDialog>
    </div>
  );
};

export default DeploymentDetailsCard;
