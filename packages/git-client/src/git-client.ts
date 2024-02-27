// TODO: Replace the any type
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface GitClient {
  token?: string;
  getUser(): Promise<any>
  getOrganizations(): Promise<any>
  getReposOfUser(user?: string): Promise<any>
  getReposOfOrganization(org: string): Promise<any>
}
