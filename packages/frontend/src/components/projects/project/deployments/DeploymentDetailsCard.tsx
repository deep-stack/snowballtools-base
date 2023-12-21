import React from 'react';

import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Typography,
} from '@material-tailwind/react';

import { relativeTime } from '../../../../utils/time';

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
    <div className="grid grid-cols-4 gap-2 border-b border-gray-300">
      <div className="col-span-2">
        <div className="flex">
          <Typography className=" basis-2/3">{deployment.title}</Typography>
          <Typography color="gray" className="basis-1/3">
            {deployment.status}
          </Typography>
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
