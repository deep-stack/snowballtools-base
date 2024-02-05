import React from 'react';
import { Project } from 'gql-client';

import { Typography, Button, Chip } from '@material-tailwind/react';

import ActivityCard from './ActivityCard';
import activityDetails from '../../../assets/activities.json';
import { relativeTimeMs } from '../../../utils/time';

interface OverviewProps {
  project: Project;
}

// TODO: Check if any live domain is set for production branch
const IS_DOMAIN_SETUP = false;

const OverviewTabPanel = ({ project }: OverviewProps) => {
  return (
    <div className="grid grid-cols-5">
      <div className="col-span-3 p-2">
        <div className="flex items-center gap-2 p-2 ">
          <div>^</div>
          <div className="grow">
            <Typography>{project.name}</Typography>
            <Typography variant="small" color="gray">
              {project.subDomain}
            </Typography>
          </div>
        </div>
        <div className="flex justify-between p-2 text-sm items-center">
          <div>
            ^ Domain
            {!IS_DOMAIN_SETUP && (
              <Chip
                className="normal-case ml-6 inline font-normal"
                size="sm"
                value="Not connected"
                icon="^"
                color="orange"
              />
            )}
          </div>
          {IS_DOMAIN_SETUP ? (
            <Chip
              className="normal-case ml-6 inline font-normal"
              size="sm"
              value="Connected"
              icon="^"
              color="green"
            />
          ) : (
            <Button className="normal-case rounded-full" color="blue" size="sm">
              Setup
            </Button>
          )}
        </div>
        {project.deployments.length !== 0 ? (
          <>
            <div className="flex justify-between p-2 text-sm">
              <p>^ Source</p>
              <p>{project.deployments[0]?.branch}</p>
            </div>
            <div className="flex justify-between p-2 text-sm">
              <p>^ Deployment</p>
              <p className="text-blue-600">
                {project.deployments[0]?.domain?.name}
              </p>
            </div>
            <div className="flex justify-between p-2 text-sm">
              <p>^ Created</p>
              <p>
                {relativeTimeMs(project.deployments[0].createdAt)} by ^{' '}
                {project.deployments[0].createdBy.name}
              </p>
            </div>
          </>
        ) : (
          <div>No current deployment found</div>
        )}
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
