import React from 'react';

import { relativeTime } from '../utils/time';

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

      <div className="grow text-sm text-gray-500">
        <p className="text-black">{activity.author}</p>
        <p className="text-xs">
          {relativeTime(activity.createdAt)} ^ {activity.branch}
        </p>
        <p>{activity.message}</p>
      </div>
    </div>
  );
};

export default ActivityCard;
