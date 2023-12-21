import React from 'react';

import { Typography } from '@material-tailwind/react';

import ActivityCard from './ActivityCard';
import activityDetails from '../../../assets/activities.json';
import { ProjectDetails } from '../../../types/project';
import { relativeTime } from '../../../utils/time';

interface OverviewProps {
  project: ProjectDetails;
}

const OverviewTabPanel = ({ project }: OverviewProps) => (
  <div className="grid grid-cols-5">
    <div className="col-span-3 p-2">
      <div className="flex items-center gap-2 p-2 ">
        <div>^</div>
        <div className="grow">
          <Typography>{project.name}</Typography>
          <Typography variant="small" color="gray">
            {project.domain}
          </Typography>
        </div>
      </div>
      <div className="flex justify-between p-2 text-sm">
        <p>Domain</p>
        {project.domain ? <p>{project.domain}</p> : <button>Set up</button>}
      </div>
      <div className="flex justify-between p-2 text-sm">
        <p>Source</p>
        <p>^ {project.source}</p>
      </div>
      <div className="flex justify-between p-2 text-sm">
        <p>deployment</p>
        <p>{project.deployment} ^</p>
      </div>
      <div className="flex justify-between p-2 text-sm">
        <p>Created</p>
        <p>
          {relativeTime(project.createdAt)} by ^ {project.createdBy}
        </p>
      </div>
    </div>
    <div className="col-span-2 p-2">
      <div className="flex justify-between">
        <Typography variant="h6">Activity</Typography>
        <button className="text-xs bg-gray-300 rounded-full p-2">
          See all
        </button>
      </div>
      <div className="p-2">
        {activityDetails.map((activity, key) => {
          return <ActivityCard activity={activity} key={key} />;
        })}
      </div>
    </div>
  </div>
);

export default OverviewTabPanel;
