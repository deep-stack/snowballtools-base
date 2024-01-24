import debug from 'debug';
import assert from 'assert';

import { deploymentToGqlType, projectMemberToGqlType, isUserOwner } from './utils';
import { Service } from './service';
import { Database } from './database';

const log = debug('snowball:database');

// TODO: Remove Database argument and refactor code to Service
export const createResolvers = async (service: Service, db: Database): Promise<any> => {
  return {
    Query: {
      // TODO: add custom type for context
      user: (_: any, __: any, context: any) => {
        return service.getUser(context.userId);
      },

      organizations: async (_:any, __: any, context: any) => {
        return service.getOrganizationsByUserId(context.userId);
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
