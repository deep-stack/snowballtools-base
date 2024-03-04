import React from 'react';
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
import { Heading } from 'components/shared/Heading';
import { OverflownText } from 'components/shared/OverflownText';
import { Tag, TagTheme } from 'components/shared/Tag';
import { getInitials } from 'utils/geInitials';
import { relativeTimeMs } from 'utils/time';
import { SHORT_COMMIT_HASH_LENGTH } from '../../../../constants';
import { formatAddress } from '../../../../utils/format';
import { DeploymentMenu } from './DeploymentMenu';

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
};

const DeploymentDetailsCard = ({
  deployment,
  currentDeployment,
  onUpdate,
  project,
  prodBranchDomains,
}: DeployDetailsCardProps) => {
  const getIconByDeploymentStatus = (status: DeploymentStatus) => {
    if (status === DeploymentStatus.Building) {
      return <LoadingIcon className="animate-spin" />;
    }
    if (status === DeploymentStatus.Ready) {
      return <CheckRoundFilledIcon />;
    }

    if (status === DeploymentStatus.Error) {
      return <WarningIcon />;
    }
  };

  return (
    <div className="flex lg:flex gap-2 lg:gap-2 2xl:gap-6 py-4 px-3 pb-6 mb-2 last:mb-0 last:pb-4 border-b border-border-separator last:border-b-transparent ">
      <div className="flex-1 max-w-[30%] space-y-2">
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
        <span className="text-sm text-elements-low-em tracking-tight">
          {deployment.environment === Environment.Production
            ? `Production ${deployment.isCurrent ? '(Current)' : ''}`
            : 'Preview'}
        </span>
      </div>

      {/* DEPLOYMENT STATUS */}
      <div className="w-[10%] max-w-[110px]">
        <Tag
          leftIcon={getIconByDeploymentStatus(deployment.status)}
          size="xs"
          type={STATUS_COLORS[deployment.status] ?? 'neutral'}
        >
          {deployment.status}
        </Tag>
      </div>

      {/* DEPLOYMENT COMMIT DETAILS */}
      <div className="text-sm w-[25%] space-y-2 text-elements-low-em">
        <span className="flex gap-1.5 items-center">
          <BranchStrokeIcon className="h-4 w-4" />
          {deployment.branch}
        </span>
        <span className="flex gap-2 items-center">
          <CommitIcon />
          <OverflownText content={deployment.commitMessage}>
            {deployment.commitHash.substring(0, SHORT_COMMIT_HASH_LENGTH)}{' '}
            {deployment.commitMessage}
          </OverflownText>
        </span>
      </div>

      {/* DEPLOYMENT INFOs */}
      <div className="ml-auto max-w-[312px] w-[30%] gap-1 2xl:gap-5 flex items-center justify-between  text-elements-low-em text-sm">
        <div className="flex w-[70%] items-center gap-0.5 2xl:gap-2 flex-1">
          <ClockOutlineIcon className="h-4 w-4" />
          <OverflownText content={relativeTimeMs(deployment.createdAt) ?? ''}>
            {relativeTimeMs(deployment.createdAt)}
          </OverflownText>
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
            // className="min-w-[200px]"
            content={formatAddress(deployment.createdBy?.name ?? '')}
          >
            {formatAddress(deployment.createdBy.name ?? '')}
          </OverflownText>
        </div>
        <DeploymentMenu
          className="ml-auto"
          deployment={deployment}
          currentDeployment={currentDeployment}
          onUpdate={onUpdate}
          project={project}
          prodBranchDomains={prodBranchDomains}
        />
      </div>
    </div>
  );
};

export default DeploymentDetailsCard;
