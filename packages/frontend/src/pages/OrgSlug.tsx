import React from 'react';
import { Outlet } from 'react-router-dom';

import { OctokitProvider } from 'context/OctokitContext';
import { Sidebar } from 'components/shared/Sidebar';

const OrgSlug = () => {
  return (
    <div className="grid grid-cols-5 h-screen bg-snowball-50">
      <>
        <div className="h-full">
          <Sidebar />
        </div>
        <div className="col-span-4 h-full p-3 overflow-y-hidden">
          <div className="bg-white rounded-3xl h-full overflow-y-auto shadow-sm">
            <OctokitProvider>
              <Outlet />
            </OctokitProvider>
          </div>
        </div>
      </>
    </div>
  );
};

export default OrgSlug;
