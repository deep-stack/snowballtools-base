// TODO: Replace the any type
/* eslint-disable @typescript-eslint/no-explicit-any */
import { GitType } from 'gql-client';

export interface GitClient {
  type: GitType
  getUser(): Promise<any>
  getOrganizations(): Promise<any>
  getReposOfUser(user?: string): Promise<any>
  getReposOfOrganization(org: string): Promise<any>
  getCommits(owner: string, repo: string, branch: string): Promise<any[]>
  getBranches(owner: string, repo: string): Promise<any[]>
  getRepo(owner: string, repo: string): Promise<any>
  getPackageJson(owner: string, repo: string, ref: string): Promise<any>
  searchRepo(query: string, user?: any, org?: any): Promise<any>
}
