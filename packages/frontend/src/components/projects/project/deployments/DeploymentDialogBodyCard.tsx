import React from 'react';

import { Typography, Chip, Card } from '@material-tailwind/react';
import { color } from '@material-tailwind/react/types/components/chip';
import { DeploymentDetails } from '../../../../types/project';
import { relativeTime } from '../../../../utils/time';

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
        deployment title
      </Typography>
      <Typography variant="small">
        ^ {deployment.branch} ^ {deployment.commit.hash}{' '}
        {deployment.commit.message}
      </Typography>
      <Typography variant="small">
        ^ {relativeTime(deployment.updatedAt)} ^ {deployment.author}
      </Typography>
    </Card>
  );
};

export default DeploymentDialogBodyCard;
