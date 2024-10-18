import { useCallback, useState } from 'react';
import {
  Deployment,
  DeploymentStatus,
  Domain,
  Environment,
  Project,
} from 'gql-client';
import { Avatar } from 'components/shared/Avatar';
import {
  BranchStrokeIcon,
  CheckRoundFilledIcon,
  ClockOutlineIcon,
  CommitIcon,
  LoadingIcon,
  WarningIcon,
} from 'components/shared/CustomIcon';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Heading } from 'components/shared/Heading';
import { OverflownText } from 'components/shared/OverflownText';
import { Tag, TagTheme } from 'components/shared/Tag';
import { Button } from 'components/shared/Button';
import { getInitials } from 'utils/geInitials';
import { relativeTimeMs } from 'utils/time';
import { SHORT_COMMIT_HASH_LENGTH } from '../../../../constants';
import { formatAddress } from '../../../../utils/format';
import { DeploymentMenu } from './DeploymentMenu';

const DEPLOYMENT_LOGS_STYLE = {
  backgroundColor: "rgba(0,0,0, .9)",
  padding: "2em",
  borderRadius: "0.5em",
  marginLeft: "0.5em",
  marginRight: "0.5em",
  color: "gray",
  fontSize: "small",
};

interface DeployDetailsCardProps {
  deployment: Deployment;
  currentDeployment: Deployment;
  onUpdate: () => Promise<void>;
  project: Project;
  prodBranchDomains: Domain[];
}

const STATUS_COLORS: {
  [key in DeploymentStatus]: TagTheme['type'];
} = {
  [DeploymentStatus.Building]: 'emphasized',
  [DeploymentStatus.Ready]: 'positive',
  [DeploymentStatus.Error]: 'negative',
  [DeploymentStatus.Deleting]: 'neutral',
};

const DeploymentDetailsCard = ({
  deployment,
  currentDeployment,
  onUpdate,
  project,
  prodBranchDomains,
}: DeployDetailsCardProps) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);
  const [deploymentLogs, setDeploymentLogs] = useState<string>();


  const getIconByDeploymentStatus = (status: DeploymentStatus) => {
    if (
      status === DeploymentStatus.Building ||
      status === DeploymentStatus.Deleting
    ) {
      return <LoadingIcon className="animate-spin" />;
    }
    if (status === DeploymentStatus.Ready) {
      return <CheckRoundFilledIcon />;
    }

    if (status === DeploymentStatus.Error) {
      return <WarningIcon />;
    }
  };

  const renderDeploymentStatus = useCallback(
    (className?: string) => {
      return (
        <div className={className}>
          <Tag
            leftIcon={getIconByDeploymentStatus(deployment.status)}
            size="xs"
            type={STATUS_COLORS[deployment.status] ?? 'neutral'}
            onClick={async()=> {
              let url = `${deployment.deployer.deployerApiUrl}/log/${deployment.applicationDeploymentRequestId}`
              const res = await fetch(url);
              const logs = await res.text()
              // console.log(">>>>RESPONSE",await res.text())
              setDeploymentLogs(logs)
              handleOpenDialog()
            }}
          >
            {deployment.status}
          </Tag>
        </div>
      );
    },
    [deployment.status, deployment.commitHash],
  );

  return (
    <div className="flex md:flex-row flex-col gap-6 py-4 px-3 pb-6 mb-2 last:mb-0 last:pb-4 border-b border-border-separator last:border-b-transparent relative">
      <div className="flex-1 flex justify-between w-full md:max-w-[30%] lg:max-w-[33%]">
        <div className="flex-1 w-full space-y-2 max-w-[90%] sm:max-w-full">
          {/* DEPLOYMENT URL */}
          {deployment.url && (
            <Heading
              className="text-sm font-medium text-elements-high-em tracking-tight"
              as="h2"
            >
              <OverflownText content={deployment.url}>
                {deployment.url}
              </OverflownText>
            </Heading>
          )}
          {deployment.deployer.deployerLrn && (
            <span className="text-sm text-elements-low-em tracking-tight block mt-2">
              Deployer LRN: {deployment.deployer.deployerLrn}
            </span>
          )}
          <span className="text-sm text-elements-low-em tracking-tight block">
            {deployment.environment === Environment.Production
              ? `Production ${deployment.isCurrent ? '(Current)' : ''}`
              : 'Preview'}
          </span>
        </div>
      </div>

      {/* DEPLOYMENT STATUS */}
      {renderDeploymentStatus('w-[10%] max-w-[110px] hidden md:flex h-fit')}

      {/* DEPLOYMENT COMMIT DETAILS */}
      <div className="flex w-full justify-between md:w-[25%]">
        <div className="text-sm max-w-[60%] md:max-w-full space-y-2 w-full text-elements-low-em">
          <span className="flex gap-1.5 items-center">
            <BranchStrokeIcon className="h-4 w-4" />
            <OverflownText content={deployment.branch}>
              {deployment.branch}
            </OverflownText>
          </span>
          <span className="flex w-full gap-2 items-center">
            <CommitIcon />
            <OverflownText content={deployment.commitMessage}>
              {deployment.commitHash.substring(0, SHORT_COMMIT_HASH_LENGTH)}{' '}
              {deployment.commitMessage}
            </OverflownText>
          </span>
        </div>
        {renderDeploymentStatus('flex md:hidden h-fit')}
      </div>

      {/* DEPLOYMENT INFOs */}
      <div className="md:ml-auto w-full md:max-w-[312px] md:w-[30%] gap-1 2xl:gap-5 flex items-center justify-between text-elements-low-em text-sm">
        <div className="flex md:w-[70%] xl:items-center gap-2 flex-1 xl:flex-row md:flex-col">
          <div className="flex gap-2 items-center">
            <ClockOutlineIcon className="h-4 w-4" />
            <OverflownText content={relativeTimeMs(deployment.createdAt) ?? ''}>
              {relativeTimeMs(deployment.createdAt)}
            </OverflownText>
          </div>
          <div className="flex gap-2 items-center">
            <div>
              <Avatar
                type="orange"
                initials={getInitials(deployment.createdBy.name ?? '')}
                className="lg:size-5 2xl:size-6"
                // TODO: Add avatarUrl
                // imageSrc={deployment.createdBy.avatarUrl}
              ></Avatar>
            </div>
            <OverflownText
              content={formatAddress(deployment.createdBy?.name ?? '')}
            >
              {formatAddress(deployment.createdBy.name ?? '')}
            </OverflownText>
          </div>
        </div>
        <DeploymentMenu
          className="ml-auto md:static absolute top-4 right-0"
          deployment={deployment}
          currentDeployment={currentDeployment}
          onUpdate={onUpdate}
          project={project}
          prodBranchDomains={prodBranchDomains}
        />
      </div>
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
        <DialogTitle>Deployment logs</DialogTitle>
        <DialogContent style={DEPLOYMENT_LOGS_STYLE} >
          {deploymentLogs && <pre >{deploymentLogs}</pre>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DeploymentDetailsCard;
