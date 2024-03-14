import React from 'react';
import { Deployment } from 'gql-client';

import { relativeTimeMs } from 'utils/time';
import { SHORT_COMMIT_HASH_LENGTH } from '../../../../constants';
import {
  BranchStrokeIcon,
  ClockOutlineIcon,
  CommitIcon,
} from 'components/shared/CustomIcon';
import { Avatar } from 'components/shared/Avatar';
import { getInitials } from 'utils/geInitials';
import { OverflownText } from 'components/shared/OverflownText';
import { Tag, TagProps } from 'components/shared/Tag';

interface DeploymentDialogBodyCardProps {
  deployment: Deployment;
  chip?: {
    value: string;
    type?: TagProps['type'];
  };
}

const DeploymentDialogBodyCard = ({
  chip,
  deployment,
}: DeploymentDialogBodyCardProps) => {
  const commit =
    deployment.commitHash.substring(0, SHORT_COMMIT_HASH_LENGTH) +
    ' ' +
    deployment.commitMessage;

  return (
    <div className="flex flex-col gap-4 px-4 py-4 rounded-xl bg-base-bg-emphasized text-elements-low-em">
      {chip && (
        <Tag className="w-fit" size="xs" type={chip.type}>
          {chip.value}
        </Tag>
      )}
      <div className="flex flex-col gap-3">
        {/* Title */}
        <p className="text-sm font-medium text-elements-high-em tracking-[0.006em]">
          {deployment.url}
        </p>
        {/* Branch & commit */}
        <div className="flex items-center gap-6 text-elements-low-em">
          <div className="flex items-center gap-2">
            <BranchStrokeIcon size={16} />
            <p className="text-sm tracking-[0.006em]">{deployment.branch}</p>
          </div>
          <div className="flex items-center gap-2 w-full">
            <CommitIcon size={16} />
            <p className="text-sm tracking-[0.006em] max-w-[80%]">
              <OverflownText content={commit}>{commit}</OverflownText>
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 text-elements-low-em">
        <ClockOutlineIcon size={16} />
        <p className="text-sm tracking-[0.006em]">
          {relativeTimeMs(deployment.createdAt)}
        </p>
        <Avatar
          size={20}
          type="orange"
          initials={getInitials(deployment.createdBy.name ?? '')}
          // TODO: Add avatar image URL
          // imageSrc={deployment.createdBy.imageUrl}
        />
        <p className="text-sm tracking-[0.006em]">
          {deployment.createdBy.name ?? 'Unknown'}
        </p>
      </div>
    </div>
  );
};

export default DeploymentDialogBodyCard;
