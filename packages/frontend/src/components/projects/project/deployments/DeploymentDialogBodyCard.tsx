import React from 'react';
import { Deployment } from 'gql-client';

import { Typography, Chip, Card } from '@material-tailwind/react';
import { color } from '@material-tailwind/react/types/components/chip';
import { relativeTimeMs } from '../../../../utils/time';
import { SHORT_COMMIT_HASH_LENGTH } from '../../../../constants';
import { formatAddress } from '../../../../utils/format';

interface DeploymentDialogBodyCardProps {
  deployment: Deployment;
  chip?: {
    value: string;
    color?: color;
  };
}

const DeploymentDialogBodyCard = ({
  chip,
  deployment,
}: DeploymentDialogBodyCardProps) => {
  return (
    <Card className="p-2 shadow-none">
      {chip && (
        <Chip
          className={`w-fit normal-case font-normal`}
          size="sm"
          value={chip.value}
          color={chip.color}
        />
      )}
      {deployment.url && (
        <Typography variant="small" className="text-black">
          {deployment.url}
        </Typography>
      )}
      <Typography variant="small">
        ^ {deployment.branch} ^{' '}
        {deployment.commitHash.substring(0, SHORT_COMMIT_HASH_LENGTH)}{' '}
        {deployment.commitMessage}
      </Typography>
      <Typography variant="small">
        ^ {relativeTimeMs(deployment.createdAt)} ^{' '}
        {formatAddress(deployment.createdBy.name ?? '')}
      </Typography>
    </Card>
  );
};

export default DeploymentDialogBodyCard;
