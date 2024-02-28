// TODO: Replace the any type
/* eslint-disable @typescript-eslint/no-explicit-any */
import { giteaApi, Api } from 'gitea-js';

import { GitClient } from './git-client';

export class GiteaClient implements GitClient {
  token?: string;
  api: Api<any>;

  constructor (giteaUrl: string, token?: string | null) {
    if (token) {
      this.token = token;

      this.api = giteaApi(giteaUrl, {
        token
      });
    } else {
      this.api = giteaApi(giteaUrl);
    }
  }

  async getUser (): Promise<any> {
    const user = (await this.api.user.userGetCurrent()).data;
    return user;
  }

  async getOrganizations (): Promise<any> {
    const orgs = (await this.api.user.orgListCurrentUserOrgs()).data;
    const updatedOrgs = orgs.map((org: any) => { return { ...org, login: org.name }; });
    return updatedOrgs;
  }

  async getReposOfUser (user: string): Promise<any> {
    const repos = (await this.api.users.userListRepos(user)).data;
    return repos;
  }

  async getReposOfOrganization (org: string): Promise<any> {
    const repos = (await this.api.orgs.orgListRepos(org)).data;
    return repos;
  }
}
