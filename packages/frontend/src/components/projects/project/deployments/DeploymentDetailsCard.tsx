import React from 'react';

import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Typography,
  Chip,
  ChipProps,
} from '@material-tailwind/react';

import { relativeTime } from '../../../../utils/time';

export enum Status {
  BUILDING = 'Building',
  READY = 'Ready',
  ERROR = 'Error',
}

export interface DeploymentDetails {
  title: string;
  status: Status;
  environment: string;
  branch: string;
  commit: {
    hash: string;
    message: string;
  };
  author: string;
  updatedAt: string;
}

interface DeployDetailsCardProps {
  deployment: DeploymentDetails;
}

const STATUS_COLORS: { [key in Status]: ChipProps['color'] } = {
  [Status.BUILDING]: 'blue',
  [Status.READY]: 'green',
  [Status.ERROR]: 'red',
};

const DeployDetailsCard = ({ deployment }: DeployDetailsCardProps) => {
  return (
    <div className="grid grid-cols-4 gap-2 border-b border-gray-300 p-3 my-2">
      <div className="col-span-2">
        <div className="flex">
          <Typography className=" basis-3/4">{deployment.title}</Typography>
          <Chip
            value={deployment.status}
            color={STATUS_COLORS[deployment.status] ?? 'gray'}
            variant="ghost"
            icon={<i>^</i>}
          />
        </div>
        <Typography color="gray">{deployment.environment}</Typography>
      </div>
      <div className="col-span-1">
        <Typography color="gray">^ {deployment.branch}</Typography>
        <Typography color="gray">
          ^ {deployment.commit.hash} {deployment.commit.message}
        </Typography>
      </div>
      <div className="col-span-1 flex items-center">
        <Typography color="gray" className="grow">
          {relativeTime(deployment.updatedAt)} ^ {deployment.author}
        </Typography>
        <Menu placement="bottom-start">
          <MenuHandler>
            <button className="self-start">...</button>
          </MenuHandler>
          <MenuList>
            <MenuItem>^ Visit</MenuItem>
            <MenuItem>^ Assign domain</MenuItem>
            <MenuItem>^ Change to production</MenuItem>
            <hr className="my-3" />
            <MenuItem>^ Redeploy</MenuItem>
            <MenuItem>^ Rollback to this version</MenuItem>
          </MenuList>
        </Menu>
      </div>
    </div>
  );
};

export default DeployDetailsCard;
