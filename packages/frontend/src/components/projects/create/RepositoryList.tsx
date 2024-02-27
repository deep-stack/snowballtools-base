import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Octokit } from 'octokit';
import assert from 'assert';
import { useDebounce } from 'usehooks-ts';

import { Button, Typography, Option } from '@material-tailwind/react';

import SearchBar from '../../SearchBar';
import ProjectRepoCard from './ProjectRepoCard';
import { GitOrgDetails, GitRepositoryDetails } from '../../../types';
import AsyncSelect from '../../shared/AsyncSelect';

const DEFAULT_SEARCHED_REPO = '';
const REPOS_PER_PAGE = 5;

interface RepositoryListProps {
  octokit: Octokit;
  token: string;
}

const RepositoryList = ({ octokit, token }: RepositoryListProps) => {
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
      if (token) {
        const userResponse = await fetch('https://gitea.com/api/v1/user', {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `token ${token}`,
          },
        });
        const userData = await userResponse.json();
        setGitUser(userData);

        const orgResponse = await fetch(
          `https://gitea.com/api/v1/users/${userData.login}/orgs`,
          {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization: `token ${token}`,
            },
          },
        );
        const orgsData = await orgResponse.json();
        // eslint-disable-next-line
        setOrgs(orgsData.map((org: any) => {return {...org, login: org.name}}));
        setSelectedAccount(userData.login);
      } else {
        const user = await octokit.rest.users.getAuthenticated();
        const orgs = await octokit.rest.orgs.listForAuthenticatedUser();
        setOrgs(orgs.data);
        setGitUser(user.data);
        setSelectedAccount(user.data.login);
      }
    };

    fetchUserAndOrgs();
  }, [octokit, token]);

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
        if (token) {
          const repoResponse = await fetch(
            `https://gitea.com/api/v1/users/${gitUser.login}/repos`,
            {
              method: 'GET',
              headers: {
                accept: 'application/json',
                Authorization: `token ${token}`,
              },
            },
          );
          const repoData = await repoResponse.json();
          setRepositoryDetails(repoData);
          return;
        } else {
          const result = await octokit.rest.repos.listForAuthenticatedUser({
            per_page: REPOS_PER_PAGE,
            affiliation: 'owner',
          });
          setRepositoryDetails(result.data);
          return;
        }
      }

      const selectedOrg = orgs.find((org) => org.login === selectedAccount);
      assert(selectedOrg, 'Selected org not found in list');

      if (token) {
        const repoResponse = await fetch(
          `https://gitea.com/api/v1/orgs/${selectedOrg.login}/repos`,
          {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization: `token ${token}`,
            },
          },
        );
        const repoData = await repoResponse.json();
        setRepositoryDetails(repoData);
      } else {
        const result = await octokit.rest.repos.listForOrg({
          org: selectedOrg.login,
          per_page: REPOS_PER_PAGE,
          type: 'all',
        });

        setRepositoryDetails(result.data);
      }
    };

    fetchRepos();
  }, [selectedAccount, gitUser, orgs, debouncedSearchedRepo, token]);

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
          <AsyncSelect
            value={selectedAccount}
            onChange={(value) => setSelectedAccount(value!)}
          >
            {accounts.map((account) => (
              <Option key={account.id} value={account.login}>
                ^ {account.login}
              </Option>
            ))}
          </AsyncSelect>
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
          return <ProjectRepoCard repository={repo} key={key} />;
        })
      ) : (
        <div className="mt-4 p-6 flex items-center justify-center">
          <div className="text-center">
            <Typography placeholder={''}>No repository found</Typography>
            <Button
              className="rounded-full mt-5"
              size="sm"
              onClick={handleResetFilters}
              placeholder={''}
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
