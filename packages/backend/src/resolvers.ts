import { Database } from './database';

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
            return {
              id: dbProject.id,
              owner: dbProject.owner,
              name: dbProject.name,
              repository: dbProject.repository,
              prodBranch: dbProject.prodBranch,
              description: dbProject.description,
              template: dbProject.template,
              framework: dbProject.framework,
              webhooks: dbProject.webhooks,
              createdAt: dbProject.createdAt,
              updatedAt: dbProject.updatedAt
            };
          });

          return {
            ...org,
            projects
          };
        });

        const orgsWithProjects = await Promise.all(orgsWithProjectsPromises);

        return orgsWithProjects;
      }
    }
  };
};
