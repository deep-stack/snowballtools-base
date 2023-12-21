import React from 'react';

import { Typography } from '@material-tailwind/react';

import { relativeTime } from '../../../utils/time';

interface ActivityDetails {
  author: string;
  authorAvatar: string;
  createdAt: string;
  branch: string;
  message: string;
}

interface ActivityCardProps {
  activity: ActivityDetails;
}

const ActivityCard = ({ activity }: ActivityCardProps) => {
  return (
    <div className="flex hover:bg-gray-200 rounded mt-1">
      <div className="w-4">{activity.authorAvatar}</div>

      <div className="grow">
        <Typography>{activity.author}</Typography>
        <Typography variant="small" color="gray">
          {relativeTime(activity.createdAt)} ^ {activity.branch}
        </Typography>
        <Typography variant="small" color="gray">
          {activity.message}
        </Typography>
      </div>
    </div>
  );
};

export default ActivityCard;
