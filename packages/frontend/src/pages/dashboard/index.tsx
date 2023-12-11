import React from 'react';
import { Outlet } from 'react-router-dom';

import Sidebar from '../../components/dashboard/Sidebar';

const Dashboard = () => {
  return (
    <div className="grid grid-cols-5 h-screen bg-sky-100">
      <div className="h-screen">
        <Sidebar />
      </div>
      <div className="col-span-4 h-screen p-3">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
