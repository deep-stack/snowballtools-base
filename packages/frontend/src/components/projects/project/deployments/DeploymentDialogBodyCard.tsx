import React from 'react';

import { Typography, Chip, Card } from '@material-tailwind/react';
import { color } from '@material-tailwind/react/types/components/chip';
import { DeploymentDetails } from '../../../../types/project';
import { relativeTimeMs } from '../../../../utils/time';

interface DeploymentDialogBodyCardProps {
  deployment: DeploymentDetails;
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
      <Typography variant="small" className="text-black">
        {deployment.url}
      </Typography>
      <Typography variant="small">
        ^ {deployment.branch} ^ {deployment.commitHash}{' '}
        {deployment.commit.message}
      </Typography>
      <Typography variant="small">
        ^ {relativeTimeMs(deployment.createdAt)} ^ {deployment.createdBy.name}
      </Typography>
    </Card>
  );
};

export default DeploymentDialogBodyCard;
