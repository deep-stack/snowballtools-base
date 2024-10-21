import { useCallback, useEffect, useMemo, useState } from 'react';
import assert from 'assert';
import { useDebounce } from 'usehooks-ts';

import { ProjectRepoCard } from 'components/projects/create/ProjectRepoCard';
import { GitOrgDetails, GitRepositoryDetails } from '../../../../types/types';
import {
  ChevronGrabberHorizontal,
  GithubIcon,
  RefreshIcon,
  SearchIcon,
} from 'components/shared/CustomIcon';
import { Select, SelectOption } from 'components/shared/Select';
import { Input } from 'components/shared/Input';
import { Button } from 'components/shared/Button';
import { useOctokit } from 'context/OctokitContext';

const DEFAULT_SEARCHED_REPO = '';
const REPOS_PER_PAGE = 5;

export const RepositoryList = () => {
  const [searchedRepo, setSearchedRepo] = useState(DEFAULT_SEARCHED_REPO);
  const [selectedAccount, setSelectedAccount] = useState<SelectOption>();
  const [orgs, setOrgs] = useState<GitOrgDetails[]>([]);
  // TODO: Add new type for Git user when required
  const [gitUser, setGitUser] = useState<GitOrgDetails>();
  const { octokit, isAuth } = useOctokit();

  const [repositoryDetails, setRepositoryDetails] = useState<
    GitRepositoryDetails[]
  >([]);

  useEffect(() => {
    const fetchUserAndOrgs = async () => {
      try {
        const user = await octokit.rest.users.getAuthenticated();
        const orgs = await octokit.rest.orgs.listForAuthenticatedUser();
        setOrgs(orgs.data);
        setGitUser(user.data);
        setSelectedAccount({ label: user.data.login, value: user.data.login });
      } catch (error) {
        // Error handled by octokit error hook interceptor in Octokit context
        console.error(error);
        return;
      }
    };

    if (isAuth) {
      fetchUserAndOrgs();
    }
  }, [octokit, isAuth]);

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
        if (selectedAccount.value === gitUser.login) {
          query = query + ` user:${selectedAccount.value}`;
        } else {
          query = query + ` org:${selectedAccount.value}`;
        }

        const result = await octokit.rest.search.repos({
          q: query,
          per_page: REPOS_PER_PAGE,
        });

        setRepositoryDetails(result.data.items);
        return;
      }

      if (selectedAccount.value === gitUser.login) {
        const result = await octokit.rest.repos.listForAuthenticatedUser({
          per_page: REPOS_PER_PAGE,
          affiliation: 'owner',
        });
        setRepositoryDetails(result.data);
        return;
      }

      const selectedOrg = orgs.find(
        (org) => org.login === selectedAccount.value,
      );
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
    setSelectedAccount({ label: gitUser.login, value: gitUser.login });
  }, [gitUser]);

  const accounts = useMemo(() => {
    if (!octokit || !gitUser) {
      return [];
    }

    return [gitUser, ...orgs];
  }, [octokit, orgs, gitUser]);

  const options = useMemo(() => {
    return accounts.map((account) => ({
      label: account.login,
      value: account.login,
      leftIcon: <GithubIcon />,
    }));
  }, [accounts]);

  return (
    <section className="space-y-3">
      {/* Dropdown and search */}
      <div className="flex flex-col lg:flex-row gap-0 lg:gap-3 items-center">
        <div className="lg:basis-1/3 w-full">
          <Select
            options={options}
            placeholder="Select a repository"
            value={selectedAccount}
            leftIcon={selectedAccount ? <GithubIcon /> : undefined}
            rightIcon={<ChevronGrabberHorizontal />}
            onChange={(value) => setSelectedAccount(value as SelectOption)}
          />
        </div>
        <div className="basis-2/3 flex w-full flex-grow">
          <Input
            className="w-full"
            value={searchedRepo}
            placeholder="Search for repository"
            leftIcon={<SearchIcon />}
            onChange={(e) => setSearchedRepo(e.target.value)}
          />
        </div>
      </div>

      {/* Repository list */}
      {Boolean(repositoryDetails.length) ? (
        <div className="flex flex-col gap-2">
          {repositoryDetails.map((repo, index) => (
            <div key={index}>
              <ProjectRepoCard repository={repo} />
              {/* Horizontal line */}
              {index !== repositoryDetails.length - 1 && (
                <div className="border-b border-border-separator/[0.06] w-full" />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 p-6 flex flex-col gap-4 items-center justify-center">
          <p className="text-elements-high-em font-sans">No repository found</p>
          <Button
            variant="tertiary"
            leftIcon={<RefreshIcon />}
            size="sm"
            onClick={handleResetFilters}
          >
            Reset filters
          </Button>
        </div>
      )}
    </section>
  );
};
