import ConfirmDialog, {
  ConfirmDialogProps,
} from 'components/shared/ConfirmDialog';
import { Deployment, Domain } from 'gql-client';

import DeploymentDialogBodyCard from 'components/projects/project/deployments/DeploymentDialogBodyCard';
import { Button } from 'components/shared/Button';
import {
  ChevronDoubleDownIcon,
  LinkChainIcon,
} from 'components/shared/CustomIcon';
import { TagProps } from 'components/shared/Tag';
import {
  ArrowRightCircleFilledIcon,
  LoadingIcon,
} from 'components/shared/CustomIcon';

interface ChangeStateToProductionDialogProps extends ConfirmDialogProps {
  deployment: Deployment;
  newDeployment?: Deployment;
  domains: Domain[];
  isConfirmButtonLoading?: boolean;
}

export const ChangeStateToProductionDialog = ({
  deployment,
  newDeployment,
  domains,
  open,
  handleCancel,
  handleConfirm,
  isConfirmButtonLoading,
  ...props
}: ChangeStateToProductionDialogProps) => {
  const currentChip = {
    value: 'Live Deployment',
    type: 'positive' as TagProps['type'],
  };
  const newChip = {
    value: 'New Deployment',
    type: 'attention' as TagProps['type'],
  };

  return (
    <ConfirmDialog
      {...props}
      handleCancel={handleCancel}
      open={open}
      handleConfirm={handleConfirm}
      confirmButtonProps={{
        disabled: isConfirmButtonLoading,
        rightIcon: isConfirmButtonLoading ? (
          <LoadingIcon className="animate-spin" />
        ) : (
          <ArrowRightCircleFilledIcon />
        ),
      }}
    >
      <div className="flex flex-col gap-7">
        <div className="flex flex-col gap-3">
          <p className="text-sm text-elements-high-em tracking-[-0.006em]">
            Upon confirmation, this deployment will be changed to production.
          </p>
          <DeploymentDialogBodyCard
            deployment={deployment}
            chip={newDeployment ? currentChip : undefined}
          />
          {newDeployment && (
            <>
              <div className="flex items-center justify-between w-full text-elements-info">
                {Array.from({ length: 7 }).map((_, index) => (
                  <ChevronDoubleDownIcon key={index} />
                ))}
              </div>
              <DeploymentDialogBodyCard
                deployment={newDeployment}
                chip={newChip}
              />
            </>
          )}
        </div>
        <div className="flex flex-col items-start gap-3">
          <p className="text-sm text-elements-high-em tracking-[-0.006em]">
            The new deployment will be associated with these domains:
          </p>
          {domains.length > 0 &&
            domains.map((value) => {
              return (
                <Button
                  as="a"
                  href={value.name}
                  leftIcon={<LinkChainIcon size={18} />}
                  variant="link"
                  key={value.id}
                >
                  {value.name}
                </Button>
              );
            })}
        </div>
      </div>
    </ConfirmDialog>
  );
};
