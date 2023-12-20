import React from 'react';

import SearchBar from '../../SearchBar';
import ProjectRepoCard from './ProjectRepoCard';
import repositoryDetails from '../../../assets/repositories.json';
import Dropdown from '../../Dropdown';

const ACCOUNT_OPTIONS = [
  { value: 'alice', label: 'Alice' },
  { value: 'bob', label: 'Bob' },
  { value: 'charlie', label: 'Charlie' },
];

const RepositoryList = () => {
  return (
    <div className="p-4">
      <div className="flex">
        <div className="basis-1/3">
          <Dropdown
            placeholder="All accounts"
            options={ACCOUNT_OPTIONS}
            onChange={() => {}}
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
