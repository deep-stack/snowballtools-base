import React from 'react';
import { Link } from 'react-router-dom';

import templateDetails from '../../assets/templates.json';
import TemplateCard from '../../components/TemplateCard';
import RepositoryList from '../../components/RepositoryList';
import ConnectAccount from '../../components/ConnectAccount';

const isGitAuth = false;

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
      <hr className="h-px bg-slate-200 border-0" />
      <h5 className="mt-4 ml-4">Start with template</h5>
      <div className="grid grid-cols-3 p-4 gap-4">
        {templateDetails.map((framework, key) => {
          return <TemplateCard framework={framework} key={key} />;
        })}
      </div>
      <h5 className="mt-4 ml-4">Import a repository</h5>
      {isGitAuth ? <RepositoryList /> : <ConnectAccount />}
    </div>
  );
};

export default CreateProject;
