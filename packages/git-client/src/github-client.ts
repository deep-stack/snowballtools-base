// TODO: Replace the any type
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Octokit } from 'octokit';

import { GitClient } from './git-client';

export class GitHubClient implements GitClient {
  token?: string;
  octokit: Octokit;

  constructor (token?: string) {
    if (token) {
      this.token = token;
      this.octokit = new Octokit({ auth: token });
    } else {
      this.octokit = new Octokit();
    }
  }

  async getUser (): Promise<any> {
    const user = await this.octokit.rest.users.getAuthenticated();
    return user;
  }

  async getOrganizations (): Promise<any> {
    const orgs = await this.octokit.rest.orgs.listForAuthenticatedUser();
    return orgs;
  }

  async getReposOfUser (): Promise<any> {
    const repos = await this.octokit.rest.repos.listForAuthenticatedUser({
      affiliation: 'owner'
    });
    return repos;
  }

  async getReposOfOrganization (org: string): Promise<any> {
    const repos = await this.octokit.rest.repos.listForOrg({
      org,
      type: 'all'
    });

    return repos;
  }
}
