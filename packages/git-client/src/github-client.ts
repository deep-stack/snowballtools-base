// TODO: Replace the any type
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Octokit } from 'octokit';

import { GitClient } from './git-client';
import { REPOS_PER_PAGE } from './constants';

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
}
