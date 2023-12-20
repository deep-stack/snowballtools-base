import React from 'react';

import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from '@material-tailwind/react';

import { relativeTime } from '../../../utils/time';

interface DeploymentDetails {
  title: string;
  status: string;
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

const DeployDetailsCard = ({ deployment }: DeployDetailsCardProps) => {
  return (
    <div className="grid grid-cols-4 gap-2 text-sm text-gray-600 border-b border-gray-300">
      <div className="col-span-2">
        <div className="flex">
          <p className=" text-gray-900 basis-2/3">{deployment.title}</p>
          <p className="basis-1/3">{deployment.status}</p>
        </div>
        <p>{deployment.environment}</p>
      </div>
      <div className="col-span-1">
        <p>{deployment.branch}</p>
        <p>
          {deployment.commit.hash} {deployment.commit.message}
        </p>
      </div>
      <div className="col-span-1 flex items-center">
        <p className="grow">
          {relativeTime(deployment.updatedAt)} ^ {deployment.author}
        </p>
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
