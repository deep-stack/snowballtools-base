import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Deployment, Domain, Environment, Project } from 'gql-client';
import { Button } from 'components/shared/Button';
import {
  GlobeIcon,
  HorizontalDotIcon,
  LinkIcon,
  RefreshIcon,
  RocketIcon,
  UndoIcon,
} from 'components/shared/CustomIcon';
import {
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from '@material-tailwind/react';
import { ComponentPropsWithRef } from 'react';
import ConfirmDialog from '../../../shared/ConfirmDialog';
import AssignDomainDialog from './AssignDomainDialog';
import DeploymentDialogBodyCard from './DeploymentDialogBodyCard';
import { Typography } from '@material-tailwind/react';
import { useGQLClient } from '../../../../context/GQLClientContext';
import { cn } from 'utils/classnames';

interface DeploymentMenuProps extends ComponentPropsWithRef<'div'> {
  deployment: Deployment;
  currentDeployment: Deployment;
  onUpdate: () => Promise<void>;
  project: Project;
  prodBranchDomains: Domain[];
}

export const DeploymentMenu = ({
  deployment,
  currentDeployment,
  onUpdate,
  project,
  prodBranchDomains,
  className,
  ...props
}: DeploymentMenuProps) => {
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
    <>
      <div className={cn('max-w-[32px]', className)} {...props}>
        <Menu placement="bottom-start">
          <MenuHandler>
            <Button
              shape="default"
              size="xs"
              variant="unstyled"
              className={cn(
                'h-8 w-8 rounded-full border border-transparent transition-colors background-transparent',
                '[&[aria-expanded=true]]:border [&[aria-expanded=true]]:border-border-interactive [&[aria-expanded=true]]:bg-controls-tertiary [&[aria-expanded=true]]:shadow-button',
              )}
              leftIcon={<HorizontalDotIcon />}
              aria-label="Toggle Menu"
            />
          </MenuHandler>
          <MenuList className="text-elements-high-em" placeholder={''}>
            <MenuItem
              className="hover:bg-base-bg-emphasized"
              disabled={!Boolean(deployment.url)}
              placeholder={''}
            >
              <a
                className="flex items-center gap-3"
                href={deployment.url}
                target="_blank"
                rel="noreferrer"
              >
                <LinkIcon /> Visit
              </a>
            </MenuItem>
            <MenuItem
              className="hover:bg-base-bg-emphasized flex items-center gap-3"
              onClick={() => setAssignDomainDialog(!assignDomainDialog)}
              placeholder={''}
            >
              <GlobeIcon /> Assign domain
            </MenuItem>
            <MenuItem
              className="hover:bg-base-bg-emphasized flex items-center gap-3"
              onClick={() => setChangeToProduction(!changeToProduction)}
              disabled={!(deployment.environment !== Environment.Production)}
              placeholder={''}
            >
              <RocketIcon /> Change to production
            </MenuItem>
            <hr className="my-3" />
            <MenuItem
              className="hover:bg-base-bg-emphasized flex items-center gap-3"
              onClick={() => setRedeployToProduction(!redeployToProduction)}
              disabled={
                !(
                  deployment.environment === Environment.Production &&
                  deployment.isCurrent
                )
              }
              placeholder={''}
            >
              <RefreshIcon /> Redeploy to production
            </MenuItem>
            <MenuItem
              className="hover:bg-base-bg-emphasized flex items-center gap-3"
              onClick={() => setRollbackDeployment(!rollbackDeployment)}
              disabled={
                deployment.isCurrent ||
                deployment.environment !== Environment.Production ||
                !Boolean(currentDeployment)
              }
              placeholder={''}
            >
              <UndoIcon /> Rollback to this version
            </MenuItem>
          </MenuList>
        </Menu>
      </div>
      {/* Dialogs */}
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
          <Typography variant="small" placeholder={''}>
            Upon confirmation, this deployment will be changed to production.
          </Typography>
          <DeploymentDialogBodyCard deployment={deployment} />
          <Typography variant="small" placeholder={''}>
            The new deployment will be associated with these domains:
          </Typography>
          {prodBranchDomains.length > 0 &&
            prodBranchDomains.map((value) => {
              return (
                <Typography
                  variant="small"
                  color="blue"
                  key={value.id}
                  placeholder={''}
                >
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
          <Typography variant="small" placeholder={''}>
            Upon confirmation, new deployment will be created with the same
            source code as current deployment.
          </Typography>
          <DeploymentDialogBodyCard deployment={deployment} />
          <Typography variant="small" placeholder={''}>
            These domains will point to your new deployment:
          </Typography>
          {deployment.domain?.name && (
            <Typography variant="small" color="blue" placeholder={''}>
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
            <Typography variant="small" placeholder={''}>
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
            <Typography variant="small" placeholder={''}>
              These domains will point to your new deployment:
            </Typography>
            <Typography variant="small" color="blue" placeholder={''}>
              ^ {currentDeployment.domain?.name}
            </Typography>
          </div>
        </ConfirmDialog>
      )}
      <AssignDomainDialog
        open={assignDomainDialog}
        handleOpen={() => setAssignDomainDialog(!assignDomainDialog)}
      />
    </>
  );
};
