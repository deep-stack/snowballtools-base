// TODO: Replace the any type
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Octokit } from 'octokit';

import { GitAccountType, GitClient } from './git-client';
import { COMMITS_PER_PAGE, REPOS_PER_PAGE } from './constants';

export class GitHubClient implements GitClient {
  token?: string;
  octokit: Octokit;

  constructor (token?: string | null) {
    if (token) {
      this.token = token;
      this.octokit = new Octokit({ auth: token });
    } else {
      this.octokit = new Octokit();
    }
  }

  async getUser (): Promise<any> {
    const user = (await this.octokit.rest.users.getAuthenticated()).data;
    return user;
  }

  async getOrganizations (): Promise<any> {
    const orgs = (await this.octokit.rest.orgs.listForAuthenticatedUser()).data;
    return orgs;
  }

  async getReposOfUser (): Promise<any> {
    const repos = (await this.octokit.rest.repos.listForAuthenticatedUser({
      affiliation: 'owner',
      per_page: REPOS_PER_PAGE
    })).data;
    return repos;
  }

  async getReposOfOrganization (org: string): Promise<any> {
    const repos = (await this.octokit.rest.repos.listForOrg({
      org,
      per_page: REPOS_PER_PAGE,
      type: 'all'
    })).data;

    return repos;
  }

  async getCommits (owner: string, repo: string, branch: string): Promise<any> {
    const commits = (await this.octokit.rest.repos.listCommits({
      owner,
      repo,
      sha: branch,
      per_page: COMMITS_PER_PAGE
    })).data;

    return commits;
  }

  async getBranches (owner: string, repo: string): Promise<any> {
    const branches = (await this.octokit.rest.repos.listBranches({
      owner,
      repo
    })).data;

    return branches;
  }

  async getRepo (owner: string, repo: string): Promise<any> {
    const repoData = (await this.octokit.rest.repos.get({
      owner,
      repo
    })).data;

    return repoData;
  }

  async searchRepos (query: string, account: any, accountType: GitAccountType): Promise<any> {
    let githubQuery = `${query} in:name fork:true`;

    if (accountType === GitAccountType.User) {
      githubQuery = githubQuery + ` user:${account.login}`;
    } else if (accountType === GitAccountType.Org) {
      githubQuery = githubQuery + ` org:${account.login}`;
    } else {
      throw new Error('Invalid account type');
    }

    const repos = (await this.octokit.rest.search.repos({
      q: githubQuery,
      per_page: REPOS_PER_PAGE
    })).data;

    return repos.items;
  }

  async getPackageJson (owner: string, repo: string, ref: string): Promise<any> {
    const packageJSON = (await this.octokit.rest.repos.getContent({
      owner,
      repo,
      path: 'package.json',
      ref
    })).data;

    return packageJSON;
  }
}
