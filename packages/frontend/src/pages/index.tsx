import React from 'react';
import { Outlet } from 'react-router-dom';

import Sidebar from '../components/Sidebar';

const Home = () => {
  return (
    <div className="grid grid-cols-5 h-screen bg-light-blue-50">
      <div className="h-full">
        <Sidebar />
      </div>
      <div className="col-span-4 h-full p-3">
        <Outlet />
      </div>
    </div>
  );
};

export default Home;
