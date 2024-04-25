import { useState } from 'react';
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
  CrossCircleIcon,
} from 'components/shared/CustomIcon';
import {
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from '@snowballtools/material-tailwind-react-fork';
import { ComponentPropsWithRef } from 'react';
import AssignDomainDialog from './AssignDomainDialog';
import { useGQLClient } from 'context/GQLClientContext';
import { cn } from 'utils/classnames';
import { ChangeStateToProductionDialog } from 'components/projects/Dialog/ChangeStateToProductionDialog';

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

  const deleteDeployment = async () => {
    const isDeleted = await client.deleteDeployment(deployment.id);
    if (isDeleted) {
      await onUpdate();
      toast.success('Deleted deployment');
    } else {
      toast.error('Unable to delete deployment');
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
          <MenuList className="text-elements-high-em">
            <MenuItem
              className="hover:bg-base-bg-emphasized"
              disabled={!Boolean(deployment.url)}
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
            >
              <GlobeIcon /> Assign domain
            </MenuItem>
            <MenuItem
              className="hover:bg-base-bg-emphasized flex items-center gap-3"
              onClick={() => setChangeToProduction(!changeToProduction)}
              disabled={!(deployment.environment !== Environment.Production)}
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
            >
              <UndoIcon /> Rollback to this version
            </MenuItem>
            <MenuItem
              className="hover:bg-base-bg-emphasized flex items-center gap-3"
              onClick={() => deleteDeployment()}
            >
              <CrossCircleIcon /> Delete deployment
            </MenuItem>
          </MenuList>
        </Menu>
      </div>
      {/* Dialogs */}
      <ChangeStateToProductionDialog
        dialogTitle="Change to production?"
        confirmButtonTitle="Change"
        handleCancel={() => setChangeToProduction((preVal) => !preVal)}
        open={changeToProduction}
        handleConfirm={async () => {
          await updateDeployment();
          setChangeToProduction((preVal) => !preVal);
        }}
        deployment={deployment}
        domains={prodBranchDomains}
      />
      <ChangeStateToProductionDialog
        dialogTitle="Redeploy to production?"
        handleCancel={() => setRedeployToProduction((preVal) => !preVal)}
        open={redeployToProduction}
        confirmButtonTitle="Redeploy"
        handleConfirm={async () => {
          await redeployToProd();
          setRedeployToProduction((preVal) => !preVal);
        }}
        deployment={deployment}
        domains={deployment.domain ? [deployment.domain] : []}
      />
      {Boolean(currentDeployment) && (
        <ChangeStateToProductionDialog
          dialogTitle="Rollback to this deployment?"
          handleCancel={() => setRollbackDeployment((preVal) => !preVal)}
          open={rollbackDeployment}
          confirmButtonTitle="Rollback"
          handleConfirm={async () => {
            await rollbackDeploymentHandler();
            setRollbackDeployment((preVal) => !preVal);
          }}
          deployment={currentDeployment}
          newDeployment={deployment}
          domains={currentDeployment.domain ? [currentDeployment.domain] : []}
        />
      )}
      <AssignDomainDialog
        open={assignDomainDialog}
        handleOpen={() => setAssignDomainDialog(!assignDomainDialog)}
      />
    </>
  );
};
