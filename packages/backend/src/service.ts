import { Database } from './database';
import { Deployment } from './entity/Deployment';
import { Domain } from './entity/Domain';
import { EnvironmentVariable } from './entity/EnvironmentVariable';
import { Organization } from './entity/Organization';
import { Project } from './entity/Project';
import { ProjectMember } from './entity/ProjectMember';
import { User } from './entity/User';

export class Service {
  private db: Database;

  constructor (db: Database) {
    this.db = db;
  }

  async getUser (userId: number): Promise<User | null> {
    return this.db.getUser(userId);
  }

  async getOrganizationsByUserId (userId: number): Promise<Organization[]> {
    const dbOrganizations = await this.db.getOrganizationsByUserId(userId);
    return dbOrganizations;
  }

  async getProjectById (projectId: string): Promise<Project | null> {
    const dbProject = await this.db.getProjectById(projectId);
    return dbProject;
  }

  async getProjectsInOrganization (userId:string, organizationId: string): Promise<Project[]> {
    const dbProjects = await this.db.getProjectsInOrganization(userId, organizationId);
    return dbProjects;
  }

  async getDeployementsByProjectId (projectId: string): Promise<Deployment[]> {
    const dbDeployments = await this.db.getDeploymentsByProjectId(projectId);
    return dbDeployments;
  }

  async getEnvironmentVariablesByProjectId (projectId: string): Promise<EnvironmentVariable[]> {
    const dbEnvironmentVariables = await this.db.getEnvironmentVariablesByProjectId(projectId);
    return dbEnvironmentVariables;
  }

  async getProjectMembersByProjectId (projectId: string): Promise<ProjectMember[]> {
    const dbProjectMembers = await this.db.getProjectMembersByProjectId(projectId);
    return dbProjectMembers;
  }

  async searchProjects (userId:string, searchText: string): Promise<Project[]> {
    const dbProjects = await this.db.getProjectsBySearchText(Number(userId), searchText);
    return dbProjects;
  }

  async getDomainsByProjectId (projectId: string): Promise<Domain[]> {
    const dbDomains = await this.db.getDomainsByProjectId(projectId);
    return dbDomains;
  }
}
