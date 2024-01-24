import { Database } from './database';
import { Organization } from './entity/Organization';
import { Project } from './entity/Project';
import { User } from './entity/User';

export class Service {
  private db: Database;

  constructor (db: Database) {
    this.db = db;
  }

  async getUser (userId: number): Promise<User | null> {
    return this.db.getUser(userId);
  }

  async getOrganizationsByUserId (userId: number): Promise<Array<Organization & { projects: Project[] }>> {
    const organizations = await this.db.getOrganizationsByUserId(userId);

    // TODO: Query organizations loaded with relations
    const orgsWithProjectsPromises = organizations.map(async (org) => {
      const dbProjects = await this.db.getProjectsByOrganizationId(org.id);

      const projectsPromises = dbProjects.map(async (dbProject) => {
        const dbProjectMembers = await this.db.getProjectMembersByProjectId(dbProject.id);
        const dbEnvironmentVariables = await this.db.getEnvironmentVariablesByProjectId(dbProject.id);

        dbProject.members = dbProjectMembers;
        dbProject.environmentVariables = dbEnvironmentVariables;

        return dbProject;
      });

      const projects = await Promise.all(projectsPromises);

      return {
        ...org,
        projects
      };
    });

    // TODO: Add organizationMembers field when / if required
    const orgsWithProjects = await Promise.all(orgsWithProjectsPromises);
    return orgsWithProjects;
  }
}
