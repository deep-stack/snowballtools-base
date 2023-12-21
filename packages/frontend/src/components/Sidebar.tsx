import React from 'react';
import { Link, NavLink } from 'react-router-dom';

import { Card, CardBody, Typography } from '@material-tailwind/react';

const Sidebar = () => {
  return (
    <div className="flex flex-col h-full p-4">
      <div className="grow">
        <div>
          <Link to="/">
            <h3 className="text-black text-2xl">Snowball</h3>
          </Link>
        </div>
        <Card className="-ml-1 my-2">
          <CardBody className="p-1 py-2">
            <Typography>Organization</Typography>
          </CardBody>
        </Card>
        <div>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? 'text-blue-500' : '')}
          >
            <Typography>Projects</Typography>
          </NavLink>
        </div>
        <div>
          <NavLink
            to="/settings"
            className={({ isActive }) => (isActive ? 'text-blue-500' : '')}
          >
            <Typography>Settings</Typography>
          </NavLink>
        </div>
      </div>
      <div className="grow flex flex-col justify-end">
        <div>Documentation</div>
        <div>Support</div>
      </div>
    </div>
  );
};

export default Sidebar;
