import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="flex flex-col h-full p-4">
      <div className="grow">
        <div>
          <h3 className="text-black text-2xl">Snowball</h3>
        </div>
        <div>Organization</div>
        <div>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? 'text-blue-500' : '')}
          >
            Projects
          </NavLink>
        </div>
        <div>
          <NavLink
            to="/settings"
            className={({ isActive }) => (isActive ? 'text-blue-500' : '')}
          >
            Settings
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
