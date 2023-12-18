import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const CreateProject = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-3xl h-full p-4">
      <div className="flex p-2">
        <div className="grow p-4">
          <h3 className="text-gray-750 text-2xl">Create new project</h3>
        </div>
        <div className="p-4">
          <button
            className="bg-slate-300 text-gray-700 text-sm px-4 py-2 border rounded-full"
            onClick={() => {
              navigate(-1);
            }}
          >
            X
          </button>
        </div>
      </div>
      <hr className="h-px bg-slate-200 border-0" />
      <Outlet />
    </div>
  );
};

export default CreateProject;
