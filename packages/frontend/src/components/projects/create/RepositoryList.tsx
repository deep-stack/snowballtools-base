import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Octokit } from 'octokit';
import assert from 'assert';
import { useDebounce } from 'usehooks-ts';
import { GiteaClient } from 'git-client';

import { Button, Typography, Option } from '@material-tailwind/react';

import SearchBar from '../../SearchBar';
import ProjectRepoCard from './ProjectRepoCard';
import { GitOrgDetails, GitRepositoryDetails } from '../../../types';
import AsyncSelect from '../../shared/AsyncSelect';
import { GithubIcon } from 'components/shared/CustomIcon';

const DEFAULT_SEARCHED_REPO = '';
const REPOS_PER_PAGE = 5;
const GITEA_ORIGIN_URL = 'https://gitea.com';

interface RepositoryListProps {
  octokit: Octokit;
  token: string;
}

const RepositoryList = ({ octokit, token }: RepositoryListProps) => {
  const [giteaClient, setGiteaClient] = useState<GiteaClient>();

  const [searchedRepo, setSearchedRepo] = useState(DEFAULT_SEARCHED_REPO);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [orgs, setOrgs] = useState<GitOrgDetails[]>([]);
  // TODO: Add new type for Git user when required
  const [gitUser, setGitUser] = useState<GitOrgDetails>();

  const [repositoryDetails, setRepositoryDetails] = useState<
    GitRepositoryDetails[]
  >([]);

  useEffect(() => {
    // TODO: Move gitea client to context
    if (token) {
      setGiteaClient(new GiteaClient(GITEA_ORIGIN_URL, `${token}`));
    }
  }, [token]);

  useEffect(() => {
    const fetchUserAndOrgs = async () => {
      if (giteaClient && token) {
        const user = await giteaClient.getUser();
        setGitUser(user);

        const orgsData = await giteaClient.getOrganizations();
        // TODO: Use same return type as octokit.getOrganizations
        // eslint-disable-next-line
        const updatedOrgs = orgsData.map((org: any) => {return {...org, login: org.name}})
        setOrgs(updatedOrgs);
        setSelectedAccount(user.login);
      } else {
        const user = await octokit.rest.users.getAuthenticated();
        const orgs = await octokit.rest.orgs.listForAuthenticatedUser();
        setOrgs(orgs.data);
        setGitUser(user.data);
        setSelectedAccount(user.data.login);
      }
    };

    fetchUserAndOrgs();
  }, [octokit, token, giteaClient]);

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
        if (giteaClient && token) {
          const repos = await giteaClient.getReposOfUser(gitUser.login);
          setRepositoryDetails(repos);
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

      if (giteaClient && token) {
        const repos = await giteaClient.getReposOfOrganization(
          selectedOrg.login,
        );
        setRepositoryDetails(repos);
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
  }, [
    selectedAccount,
    gitUser,
    orgs,
    debouncedSearchedRepo,
    token,
    giteaClient,
  ]);

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
      <div className="flex gap-2 mb-2 items-center">
        <div className="basis-1/3">
          <AsyncSelect
            value={selectedAccount}
            onChange={(value) => setSelectedAccount(value!)}
          >
            {accounts.map((account) => (
              <Option key={account.id} value={account.login}>
                <div className="flex items-center gap-2 justify-start">
                  <GithubIcon /> {account.login}
                </div>
              </Option>
            ))}
          </AsyncSelect>
        </div>
        <div className="basis-2/3 flex-grow flex items-center">
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
