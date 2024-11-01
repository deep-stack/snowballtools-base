import { useState, ComponentPropsWithRef } from 'react';

import {
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from '@snowballtools/material-tailwind-react-fork';

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
import AssignDomainDialog from './AssignDomainDialog';
import { useGQLClient } from 'context/GQLClientContext';
import { cn } from 'utils/classnames';
import { ChangeStateToProductionDialog } from 'components/projects/Dialog/ChangeStateToProductionDialog';
import { useToast } from 'components/shared/Toast';
import { DeleteDeploymentDialog } from 'components/projects/Dialog/DeleteDeploymentDialog';

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
  const { toast, dismiss } = useToast();

  const [changeToProduction, setChangeToProduction] = useState(false);
  const [redeployToProduction, setRedeployToProduction] = useState(false);
  const [deleteDeploymentDialog, setDeleteDeploymentDialog] = useState(false);
  const [isConfirmDeleteLoading, setIsConfirmDeleteLoading] = useState(false);
  const [rollbackDeployment, setRollbackDeployment] = useState(false);
  const [assignDomainDialog, setAssignDomainDialog] = useState(false);
  const [isConfirmButtonLoading, setConfirmButtonLoadingLoading] =
    useState(false);

  const updateDeployment = async () => {
    const isUpdated = await client.updateDeploymentToProd(deployment.id);
    if (isUpdated.updateDeploymentToProd) {
      await onUpdate();
      toast({
        id: 'deployment_changed_to_production',
        title: 'Deployment changed to production',
        variant: 'success',
        onDismiss: dismiss,
      });
    } else {
      toast({
        id: 'deployment_not_changed_to_production',
        title: 'Error changing deployment to production',
        variant: 'error',
        onDismiss: dismiss,
      });
    }
  };

  const redeployToProd = async () => {
    const isRedeployed = await client.redeployToProd(deployment.id);
    setConfirmButtonLoadingLoading(false);
    if (isRedeployed.redeployToProd) {
      await onUpdate();
      toast({
        id: 'redeployed_to_production',
        title: 'Redeployed to production',
        variant: 'success',
        onDismiss: dismiss,
      });
    } else {
      toast({
        id: 'redeployed_to_production_failed',
        title: 'Error redeploying to production',
        variant: 'error',
        onDismiss: dismiss,
      });
    }
  };

  const rollbackDeploymentHandler = async () => {
    const isRollbacked = await client.rollbackDeployment(
      project.id,
      deployment.id,
    );
    if (isRollbacked.rollbackDeployment) {
      await onUpdate();
      toast({
        id: 'deployment_rolled_back',
        title: 'Deployment rolled back',
        variant: 'success',
        onDismiss: dismiss,
      });
    } else {
      toast({
        id: 'deployment_rollback_failed',
        title: 'Error rolling back deployment',
        variant: 'error',
        onDismiss: dismiss,
      });
    }
  };

  const deleteDeployment = async () => {
    const isDeleted = await client.deleteDeployment(deployment.id);

    setIsConfirmDeleteLoading(false);
    setDeleteDeploymentDialog((preVal) => !preVal);

    if (isDeleted.deleteDeployment) {
      await onUpdate();
      toast({
        id: 'deployment_removal_requested',
        title: 'Deployment removal requested',
        variant: 'success',
        onDismiss: dismiss,
      });
    } else {
      toast({
        id: 'deployment_not_deleted',
        title: 'Error deleting deployment',
        variant: 'error',
        onDismiss: dismiss,
      });
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
              onClick={() => setDeleteDeploymentDialog((preVal) => !preVal)}
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
          setConfirmButtonLoadingLoading(true);
          await redeployToProd();
          setRedeployToProduction((preVal) => !preVal);
        }}
        deployment={deployment}
        domains={deployment.domain ? [deployment.domain] : []}
        isConfirmButtonLoading={isConfirmButtonLoading}
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
      <DeleteDeploymentDialog
        open={deleteDeploymentDialog}
        handleConfirm={async () => {
          setIsConfirmDeleteLoading(true);
          await deleteDeployment();
        }}
        handleCancel={() => setDeleteDeploymentDialog((preVal) => !preVal)}
        isConfirmButtonLoading={isConfirmDeleteLoading}
      />
    </>
  );
};
