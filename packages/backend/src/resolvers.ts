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
        const organizations = await db.getOrganizationsbyUserId(context.userId);

        const orgsWithProjectsPromises = organizations.map(async (org) => {
          const dbProjects = await db.getProjectsbyOrganizationId(org.id);

          const projects = dbProjects.map(dbProject => {
            return projectToGqlType(dbProject);
          });

          return {
            ...org,
            projects
          };
        });

        const orgsWithProjects = await Promise.all(orgsWithProjectsPromises);

        // TODO: Populate members field when / if required
        return orgsWithProjects;
      }
    }
  };
};
