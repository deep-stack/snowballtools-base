import React, { useMemo } from 'react';

import { Typography, Button, Chip } from '@material-tailwind/react';

import ActivityCard from './ActivityCard';
import activityDetails from '../../../assets/activities.json';
import { ProjectDetails } from '../../../types/project';
import { relativeTimeMs } from '../../../utils/time';

interface OverviewProps {
  project: ProjectDetails;
}

const OverviewTabPanel = ({ project }: OverviewProps) => {
  const currentDeploymentTitle = useMemo(() => {
    const deployment = project.deployments.find((deployment) => {
      return deployment.isCurrent === true;
    });

    return deployment?.title;
  }, []);

  return (
    <div className="grid grid-cols-5">
      <div className="col-span-3 p-2">
        <div className="flex items-center gap-2 p-2 ">
          <div>^</div>
          <div className="grow">
            <Typography>{project.name}</Typography>
            <Typography variant="small" color="gray">
              {project.url}
            </Typography>
          </div>
        </div>
        <div className="flex justify-between p-2 text-sm items-center">
          <div>
            ^ Domain
            {!project.domain && (
              <Chip
                className="normal-case ml-6 bg-[#FED7AA] text-[#EA580C] inline font-normal"
                size="sm"
                value="Not connected"
                icon="^"
              />
            )}
          </div>
          {project.domain ? (
            <p>{project.domain}</p>
          ) : (
            <Button className="normal-case rounded-full" color="blue" size="sm">
              Setup
            </Button>
          )}
        </div>
        <div className="flex justify-between p-2 text-sm">
          <p>^ Source</p>
          <p>{project.source}</p>
        </div>
        <div className="flex justify-between p-2 text-sm">
          <p>^ Deployment</p>
          <p className="text-blue-600">{currentDeploymentTitle}</p>
        </div>
        <div className="flex justify-between p-2 text-sm">
          <p>^ Created</p>
          <p>
            {relativeTimeMs(project.createdAt)} by ^ {project.createdBy}
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
};

export default OverviewTabPanel;
