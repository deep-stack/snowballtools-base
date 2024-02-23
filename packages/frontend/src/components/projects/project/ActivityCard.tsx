import React from 'react';

import { Typography, IconButton, Avatar } from '@material-tailwind/react';

import { relativeTimeISO } from '../../../utils/time';
import { GitCommitWithBranch } from '../../../types';

interface ActivityCardProps {
  activity: GitCommitWithBranch;
}

const ActivityCard = ({ activity }: ActivityCardProps) => {
  return (
    <div className="group flex gap-2 hover:bg-gray-200 rounded mt-1">
      <div className="w-8">
        <Avatar src={activity.author?.avatar_url} variant="rounded" size="sm" />
      </div>
      <div className="grow">
        <Typography>{activity.commit.author?.name}</Typography>
        <Typography variant="small" color="gray">
          {relativeTimeISO(activity.commit.author!.date!)} ^{' '}
          {activity.branch.name}
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
