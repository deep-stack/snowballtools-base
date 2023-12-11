import React from 'react'
import { Outlet } from "react-router-dom";

import Sidebar from "../../components/dashboard/Sidebar";

const Dashboard = () => {
  return (
    <div className='grid grid-cols-5 gap-4 h-screen'>
      <div className="min-w-[300px]">
        <Sidebar />
      </div>
      <div className="col-span-4">
        <Outlet />
      </div>
    </div>
  )
}

export default Dashboard
