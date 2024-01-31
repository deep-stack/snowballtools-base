import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Octokit } from 'octokit';
import assert from 'assert';
import { useDebounce } from 'usehooks-ts';

import { Button, Typography, Option, Select } from '@material-tailwind/react';

import SearchBar from '../../SearchBar';
import ProjectRepoCard from './ProjectRepoCard';
import { GitOrgDetails, GitRepositoryDetails } from '../../../types/project';

const DEFAULT_SEARCHED_REPO = '';
const REPOS_PER_PAGE = 5;

interface RepositoryListProps {
  repoSelectionHandler: (repo: GitRepositoryDetails) => void;
  octokit: Octokit;
}

const RepositoryList = ({
  repoSelectionHandler,
  octokit,
}: RepositoryListProps) => {
  const [searchedRepo, setSearchedRepo] = useState(DEFAULT_SEARCHED_REPO);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [orgs, setOrgs] = useState<GitOrgDetails[]>([]);
  // TODO: Add new type for Git user when required
  const [gitUser, setGitUser] = useState<GitOrgDetails>();

  const [repositoryDetails, setRepositoryDetails] = useState<
    GitRepositoryDetails[]
  >([]);

  useEffect(() => {
    const fetchUserAndOrgs = async () => {
      const user = await octokit.rest.users.getAuthenticated();
      const orgs = await octokit.rest.orgs.listForAuthenticatedUser();
      setOrgs(orgs.data);
      setGitUser(user.data);
      setSelectedAccount(user.data.login);
    };

    fetchUserAndOrgs();
  }, [octokit]);

  const debouncedSearchedRepo = useDebounce<string>(searchedRepo, 500);

  useEffect(() => {
    const fetchRepos = async () => {
      if (!selectedAccount || !gitUser) {
        return;
      }

      // Check search input and use GitHub search API
      if (debouncedSearchedRepo) {
        let query = `${debouncedSearchedRepo} in:name fork:true`;

        // Check if selected account is an organization
        if (selectedAccount === gitUser.login) {
          query = query + ` user:${selectedAccount}`;
        } else {
          query = query + ` org:${selectedAccount}`;
        }

        const result = await octokit.rest.search.repos({
          q: query,
          per_page: REPOS_PER_PAGE,
        });

        setRepositoryDetails(result.data.items);
        return;
      }

      if (selectedAccount === gitUser.login) {
        const result = await octokit.rest.repos.listForAuthenticatedUser({
          per_page: REPOS_PER_PAGE,
          affiliation: 'owner',
        });
        setRepositoryDetails(result.data);
        return;
      }

      const selectedOrg = orgs.find((org) => org.login === selectedAccount);
      assert(selectedOrg, 'Selected org not found in list');

      const result = await octokit.rest.repos.listForOrg({
        org: selectedOrg.login,
        per_page: REPOS_PER_PAGE,
        type: 'all',
      });

      setRepositoryDetails(result.data);
    };

    fetchRepos();
  }, [selectedAccount, gitUser, orgs, debouncedSearchedRepo]);

  const handleResetFilters = useCallback(() => {
    assert(gitUser, 'Git user is not available');
    setSearchedRepo(DEFAULT_SEARCHED_REPO);
    setSelectedAccount(gitUser.login);
  }, [gitUser]);

  const accounts = useMemo(() => {
    if (!octokit || !gitUser) {
      return [];
    }

    return [gitUser, ...orgs];
  }, [octokit, orgs, gitUser]);

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-2">
        <div className="basis-1/3">
          {/* TODO: Fix selection of Git user at start */}
          <Select
            value={selectedAccount}
            onChange={(value) => setSelectedAccount(value!)}
          >
            {accounts.map((account) => (
              <Option key={account.id} value={account.login}>
                ^ {account.login}
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
      {Boolean(repositoryDetails.length) ? (
        repositoryDetails.map((repo, key) => {
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
