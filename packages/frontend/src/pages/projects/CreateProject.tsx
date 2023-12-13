import React from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../../components/SearchBar';

const ProjectRepoCard = () => {
  return (
    <div className="flex text-gray-500 text-xs bg-gray-100 m-2">
      <div>^</div>
      <div className="grow">
        <p>Project title</p>
        <p>5 minutes ago</p>
      </div>
    </div>
  );
};

const FrameworkCard = () => {
  return (
    <div className="bg-gray-200 text-gray-500 text-xs  border-gray-200 rounded-lg shadow p-4">
      Framework Cards
    </div>
  );
};

const RepositoryList = () => {
  return (
    <div className="p-4">
      <div className="flex">
        <div className="basis-1/3">
          <SearchBar handler={() => {}} placeholder="All accounts" />
        </div>
        <div className="basis-2/3">
          <SearchBar handler={() => {}} placeholder="Search for repositorry" />
        </div>
      </div>
      <div>
        <ProjectRepoCard />
        <ProjectRepoCard />
        <ProjectRepoCard />
        <ProjectRepoCard />
      </div>
    </div>
  );
};

const CreateProject = () => {
  return (
    <div className="bg-white rounded-3xl h-full">
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
        <FrameworkCard />
        <FrameworkCard />
        <FrameworkCard />
        <FrameworkCard />
      </div>
      <h5 className="mt-4 ml-4">Import a repository</h5>
      <RepositoryList />
    </div>
  );
};

export default CreateProject;
