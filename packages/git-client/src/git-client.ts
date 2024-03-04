// TODO: Replace the any type
/* eslint-disable @typescript-eslint/no-explicit-any */

export enum GitAccountType {
  User = 'User',
  Org = 'Org'
}

export interface GitClient {
  getUser(): Promise<any>
  getOrganizations(): Promise<any>
  getReposOfUser(user?: string): Promise<any>
  getReposOfOrganization(org: string): Promise<any>
  getCommits(owner: string, repo: string, branch: string): Promise<any>
  getBranches(owner: string, repo: string): Promise<any>
  getBranches(owner: string, repo: string): Promise<any>
  getRepo(owner: string, repo: string): Promise<any>
  getPackageJson(owner: string, repo: string, ref: string): Promise<any>
  searchRepos(query: string, account: any, accountType: GitAccountType): Promise<any>
}
