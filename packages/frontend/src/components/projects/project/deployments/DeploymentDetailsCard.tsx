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

import { relativeTimeMs } from '../../../../utils/time';
import ConfirmDialog from '../../../shared/ConfirmDialog';
import DeploymentDialogBodyCard from './DeploymentDialogBodyCard';
import { DeploymentDetails, Status } from '../../../../types/project';

interface DeployDetailsCardProps {
  deployment: DeploymentDetails;
  productionDeployment: DeploymentDetails;
}

const STATUS_COLORS: { [key in Status]: ChipProps['color'] } = {
  [Status.BUILDING]: 'blue',
  [Status.READY]: 'green',
  [Status.ERROR]: 'red',
};

const DeploymentDetailsCard = ({
  deployment,
  productionDeployment,
}: DeployDetailsCardProps) => {
  const [changeToProduction, setChangeToProduction] = useState(false);
  const [redeployToProduction, setRedeployToProduction] = useState(false);
  const [rollbackDeployment, setRollbackDeployment] = useState(false);

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
          {deployment.isProduction ? 'Production (Current)' : 'Preview'}
        </Typography>
      </div>
      <div className="col-span-1">
        <Typography color="gray">^ {deployment.branch}</Typography>
        <Typography color="gray">
          ^ {deployment.commit.hash} {deployment.commit.message}
        </Typography>
      </div>
      <div className="col-span-1 flex items-center">
        <Typography color="gray" className="grow">
          {relativeTimeMs(deployment.updatedAt)} ^ {deployment.author}
        </Typography>
        <Menu placement="bottom-start">
          <MenuHandler>
            <button className="self-start">...</button>
          </MenuHandler>
          <MenuList>
            <MenuItem>^ Visit</MenuItem>
            <MenuItem>^ Assign domain</MenuItem>
            {!deployment.isProduction && (
              <MenuItem
                onClick={() => setChangeToProduction(!changeToProduction)}
              >
                ^ Change to production
              </MenuItem>
            )}

            <hr className="my-3" />
            <MenuItem
              onClick={() => setRedeployToProduction(!redeployToProduction)}
            >
              ^ Redeploy to production
            </MenuItem>
            {!deployment.isProduction && (
              <MenuItem
                onClick={() => setRollbackDeployment(!rollbackDeployment)}
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
        handleConfirm={() => setChangeToProduction((preVal) => !preVal)}
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
        handleConfirm={() => setRedeployToProduction((preVal) => !preVal)}
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
        handleConfirm={() => setRollbackDeployment((preVal) => !preVal)}
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
