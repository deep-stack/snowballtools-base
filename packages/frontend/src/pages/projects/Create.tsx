import React from 'react';
import { Outlet, Link } from 'react-router-dom';

import HorizontalLine from '../../components/HorizontalLine';

const CreateProject = () => {
  return (
    <div className="bg-white rounded-3xl h-full p-4">
      <div className="flex p-2">
        <div className="grow p-4">
          <h3 className="text-gray-750 text-2xl">Create new project</h3>
        </div>
        <div className="p-4">
          <Link to="/">
            <button className="bg-slate-300 text-gray-700 text-sm px-4 py-2 border rounded-full">
              X
            </button>
          </Link>
        </div>
      </div>
      <HorizontalLine />
      <Outlet />
    </div>
  );
};

export default CreateProject;
