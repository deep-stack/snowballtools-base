import debug from 'debug';
import assert from 'assert';

import { Database } from './database';
import { deploymentToGqlType, projectMemberToGqlType, projectToGqlType, environmentVariableToGqlType, isUserOwner } from './utils';

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

          const projectsPromises = dbProjects.map(async (dbProject) => {
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

          const projects = await Promise.all(projectsPromises);

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
      },

      projectMembers: async (_: any, { projectId }: { projectId: string }) => {
        const dbProjectMembers = await db.getProjectMembersByProjectId(projectId);

        const projectMembers = dbProjectMembers.map(dbProjectMember => {
          return projectMemberToGqlType(dbProjectMember);
        });

        return projectMembers;
      },

      searchProjects: async (_: any, { searchText }: { searchText: string }, context: any) => {
        const dbProjectMembers = await db.getProjectsBySearchText(context.userId, searchText);

        const projectsPromise = dbProjectMembers.map(async (projectMember) => {
          return projectToGqlType(projectMember.project, [], []);
        });

        const projects = await Promise.all(projectsPromise);
        return projects;
      }
    },

    Mutation: {
      removeMember: async (_: any, { memberId }: { memberId: string }, context: any) => {
        try {
          const member = await db.getProjectMemberByMemberId(memberId);

          if (member.member.id === context.userId) {
            throw new Error('Invalid operation: cannot remove self');
          }

          const memberProject = member.project;
          assert(memberProject);

          if (isUserOwner(String(context.userId), String(memberProject.owner.id))) {
            return db.removeProjectMemberByMemberId(memberId);
          } else {
            throw new Error('Invalid operation: not authorized');
          }
        } catch (err) {
          log(err);
          return false;
        }
      },

      addEnvironmentVariables: async (_: any, { projectId, environmentVariables }: { projectId: string, environmentVariables: { environments: string[], key: string, value: string}[] }) => {
        try {
          return db.addEnvironmentVariablesByProjectId(projectId, environmentVariables);
        } catch (err) {
          log(err);
          return false;
        }
      }
    }
  };
};
