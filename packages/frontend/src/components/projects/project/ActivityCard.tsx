import React from 'react';

import { Typography, IconButton } from '@material-tailwind/react';

import { relativeTime } from '../../../utils/time';
import { GitCommitDetails } from '../../../types/project';

interface ActivityCardProps {
  activity: GitCommitDetails;
}

const ActivityCard = ({ activity }: ActivityCardProps) => {
  return (
    <div className="group flex hover:bg-gray-200 rounded mt-1">
      <div className="w-4">^</div>

      <div className="grow">
        <Typography>{activity.commit.author?.name}</Typography>
        <Typography variant="small" color="gray">
          {relativeTime(activity.commit.author!.date!)} ^ {activity.branch.name}
        </Typography>
        <Typography variant="small" color="gray">
          {activity.commit.message}
        </Typography>
      </div>
      <div className="mr-2 self-center hidden group-hover:block">
        <IconButton size="sm" className="rounded-full bg-gray-600">
          {'>'}
        </IconButton>
      </div>
    </div>
  );
};

export default ActivityCard;
