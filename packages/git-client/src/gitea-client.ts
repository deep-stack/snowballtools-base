// TODO: Replace the any type
/* eslint-disable @typescript-eslint/no-explicit-any */
import { giteaApi, Api } from 'gitea-js';
import { GitType } from 'gql-client';

import { GitClient, CreateUsingTemplateParams } from './git-client';

export class GiteaClient implements GitClient {
  token?: string;
  api: Api<any>;
  type: GitType;

  constructor (giteaUrl: string, token?: string | null) {
    this.type = GitType.Gitea;

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

  async getCommits (owner: string, repo: string, branch: string): Promise<any> {
    const commits = (await this.api.repos.repoGetAllCommits(owner, repo, { sha: branch })).data;
    return commits;
  }

  async getBranches (owner: string, repo: string): Promise<any> {
    const branches = (await this.api.repos.repoListBranches(owner, repo)).data;
    return branches;
  }

  async getRepo (owner: string, repo: string): Promise<any> {
    const repoData = (await this.api.repos.repoGet(owner, repo)).data;
    return repoData;
  }

  async searchRepo (query: string, user?: any, org?: any): Promise<any> {
    const giteaQuery = {
      q: query
    };

    if (user) {
      Object.assign(giteaQuery, { uid: user.id, exclusive: true });
    } else if (org) {
      // TODO: Check org search not working for gitea
      Object.assign(giteaQuery, { team_id: org.id });
    }

    const repos = (await this.api.repos.repoSearch(giteaQuery)).data;

    return repos.data;
  }

  async getPackageJson (owner: string, repo: string, ref: string): Promise<any> {
    const packageJSON = (await this.api.repos.repoGetContents(
      owner,
      repo,
      'package.json',
      {
        ref
      }
    )).data;

    return packageJSON;
  }

  async createUsingTemplate (data: CreateUsingTemplateParams): Promise<any> {
    const repo = (await this.api.repos.generateRepo(data.tempateOwner, data.templateRepo, {
      owner: data.repoOwner,
      name: data.repoName,
      private: data.isPrivate
    })).data;

    return repo;
  }
}
