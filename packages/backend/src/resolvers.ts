import debug from 'debug';

import { Database } from './database';
import { deploymentToGqlType, projectMemberToGqlType, projectToGqlType, environmentVariableToGqlType } from './utils';

const log = debug('snowball:database');

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

          const projectsWithPromises = dbProjects.map(async (dbProject) => {
            const dbProjectMembers = await db.getProjectMembersByProjectId(dbProject.id);
            const dbEnvironmentVariables = await db.getEnvironmentVariablesByProjectId(dbProject.id);

            const projectMembers = dbProjectMembers.map(dbProjectMember => {
              return projectMemberToGqlType(dbProjectMember);
            });

            const environmentVariables = dbEnvironmentVariables.map(dbEnvironmentVariable => {
              return environmentVariableToGqlType(dbEnvironmentVariable);
            });

            return projectToGqlType(dbProject, projectMembers, environmentVariables);
          });

          const projects = await Promise.all(projectsWithPromises);

          return {
            ...org,
            projects
          };
        });

        // TODO: Add organizationMembers field when / if required
        const orgsWithProjects = await Promise.all(orgsWithProjectsPromises);
        return orgsWithProjects;
      },

      deployments: async (_: any, { projectId }: { projectId: string }) => {
        const dbDeployments = await db.getDeploymentsByProjectId(projectId);

        const deployments = dbDeployments.map(dbDeployment => {
          return deploymentToGqlType(dbDeployment);
        });

        return deployments;
      }
    },

    Mutation: {
      removeMember: async (_: any, { memberId }:{memberId: string}) => {
        try {
          return await db.removeProjectMemberByMemberId(memberId);
        } catch (error) {
          log(error);
          return false;
        }
      }
    }
  };
};
