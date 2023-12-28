import React, { useCallback, useMemo, useState } from 'react';

import { Button, Typography, Option, Select } from '@material-tailwind/react';

import SearchBar from '../../SearchBar';
import ProjectRepoCard from './ProjectRepoCard';
import repositoryDetails from '../../../assets/repositories.json';
import { RepositoryDetails } from '../../../types/project';

const DEFAULT_SEARCHED_REPO = '';
const DEFAULT_SELECTED_USER = 'All accounts';

interface RepositoryListProps {
  repoSelectionHandler: (repo: RepositoryDetails) => void;
}

const RepositoryList = ({ repoSelectionHandler }: RepositoryListProps) => {
  const [searchedRepo, setSearchedRepo] = useState(DEFAULT_SEARCHED_REPO);
  const [selectedUser, setSelectedUser] = useState(DEFAULT_SELECTED_USER);

  const filteredRepos = useMemo(() => {
    return repositoryDetails.filter((repo) => {
      const titleMatch =
        !searchedRepo ||
        repo.title.toLowerCase().includes(searchedRepo.toLowerCase());
      const userMatch =
        selectedUser === DEFAULT_SELECTED_USER || selectedUser === repo.user;
      return titleMatch && userMatch;
    });
  }, [searchedRepo, selectedUser]);

  const handleResetFilters = useCallback(() => {
    setSearchedRepo(DEFAULT_SEARCHED_REPO);
    setSelectedUser(DEFAULT_SELECTED_USER);
  }, []);

  const users = useMemo(() => {
    return [
      DEFAULT_SELECTED_USER,
      ...Array.from(new Set(repositoryDetails.map((repo) => repo.user))),
    ];
  }, []);

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-2">
        <div className="basis-1/3">
          <Select
            value={selectedUser}
            onChange={(value) => setSelectedUser(value!)}
          >
            {users.map((user, key) => (
              <Option
                className={user === selectedUser ? 'hidden' : ''}
                key={key}
                value={user}
              >
                ^ {user}
              </Option>
            ))}
          </Select>
        </div>
        <div className="basis-2/3">
          <SearchBar
            value={searchedRepo}
            onChange={(event) => setSearchedRepo(event.target.value)}
            placeholder="Search for repository"
          />
        </div>
      </div>
      {Boolean(filteredRepos.length) ? (
        filteredRepos.map((repo, key) => {
          return (
            <ProjectRepoCard
              repository={repo}
              key={key}
              onClick={() => {
                repoSelectionHandler(repo);
              }}
            />
          );
        })
      ) : (
        <div className="mt-4 p-6 flex items-center justify-center">
          <div className="text-center">
            <Typography>No repository found</Typography>
            <Button
              className="rounded-full mt-5"
              size="sm"
              onClick={handleResetFilters}
            >
              ^ Reset filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RepositoryList;
