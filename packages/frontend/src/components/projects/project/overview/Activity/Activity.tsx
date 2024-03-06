import React from 'react';

import { GitCommitWithBranch } from 'types';
import { Heading } from 'components/shared/Heading';
import ActivityCard from './ActivityCard';
import { Button } from 'components/shared/Button';

export const Activity = ({
  activities,
}: {
  activities: GitCommitWithBranch[];
}) => {
  return (
    <div className="col-span-5 md:col-span-2 mr-1">
      <div className="flex items-center justify-between">
        <Heading className="text-lg leading-6 font-medium">Activity</Heading>
        <Button variant="tertiary" size="sm">
          See all
        </Button>
      </div>
      <div className="mt-5">
        {activities.map((activity, index) => {
          return <ActivityCard activity={activity} key={`activity-${index}`} />;
        })}
      </div>
    </div>
  );
};
