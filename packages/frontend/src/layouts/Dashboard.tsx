import React from 'react';
import { Outlet } from 'react-router-dom';

import Sidebar from '../components/Sidebar';

const Dashboard = () => {
  return (
    <div className="grid grid-cols-5 h-screen bg-light-blue-50">
      <div className="h-full">
        <Sidebar />
      </div>
      <div className="col-span-4 h-full p-3">
        <div className="bg-white rounded-3xl h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
