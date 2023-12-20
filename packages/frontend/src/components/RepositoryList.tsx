import React from 'react';

import SearchBar from './SearchBar';
import ProjectRepoCard from './ProjectRepoCard';
import repositoryDetails from '../assets/repositories.json';

const RepositoryList = () => {
  return (
    <div className="p-4">
      <div className="flex">
        <div className="basis-1/3">
          <input
            type="text"
            placeholder="All accounts"
            className="text-gray-700 text-xs w-full border-none focus:outline-none"
          />
        </div>
        <div className="basis-2/3">
          <SearchBar onChange={() => {}} placeholder="Search for repository" />
        </div>
      </div>
      {repositoryDetails.map((repo, key) => {
        return <ProjectRepoCard repository={repo} key={key} />;
      })}
    </div>
  );
};

export default RepositoryList;
