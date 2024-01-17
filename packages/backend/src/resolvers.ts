import { Database } from './database';
import { projectToGqlType } from './utils';

export const createResolvers = async (db: Database): Promise<any> => {
  return {
    Query: {
      // TODO: add custom type for context
      user: (_: any, __: any, context: any) => {
        return db.getUser(context.userId);
      },

      organizations: async (_:any, __: any, context: any) => {
        const organizations = await db.getOrganizationsByUserId(context.userId);

        const orgsWithProjectsPromises = organizations.map(async (org) => {
          const dbProjects = await db.getProjectsByOrganizationId(org.id);

          const projects = await Promise.all(dbProjects.map(async (dbProject) => {
            const projectMembers = await db.getProjectMembers(dbProject.id);

            // TODO: Add projectMembersToGqlType
            return projectToGqlType(dbProject, projectMembers);
          }));

          return {
            ...org,
            projects
          };
        });

        const orgsWithProjects = await Promise.all(orgsWithProjectsPromises);

        // TODO: Populate members field when / if required
        return orgsWithProjects;
      },

      deployments: async (_: any, { projectId }: { projectId: string }) => {
        // TODO: Add deploymentToGqlType
        return db.getDeploymentsByProjectId(projectId);
      }
    }
  };
};
