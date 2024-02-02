import debug from 'debug';
import assert from 'assert';
import { DeepPartial } from 'typeorm';

import { OAuthApp } from '@octokit/oauth-app';

import { Service } from './service';
import { Database } from './database';
import { isUserOwner } from './utils';
import { Environment } from './entity/Deployment';
import { Permission } from './entity/ProjectMember';
import { Domain } from './entity/Domain';
import { Project } from './entity/Project';

const log = debug('snowball:database');

// TODO: Remove Database argument and refactor code to Service
export const createResolvers = async (db: Database, app: OAuthApp, service: Service): Promise<any> => {
  return {
    Query: {
      // TODO: add custom type for context
      user: (_: any, __: any, context: any) => {
        return service.getUser(context.userId);
      },

      organizations: async (_:any, __: any, context: any) => {
        return service.getOrganizationsByUserId(context.userId);
      },

      project: async (_: any, { projectId }: { projectId: string }) => {
        return service.getProjectById(projectId);
      },

      projectsInOrganization: async (_: any, { organizationId }: {organizationId: string }, context: any) => {
        return service.getProjectsInOrganization(context.userId, organizationId);
      },

      deployments: async (_: any, { projectId }: { projectId: string }) => {
        return service.getDeployementsByProjectId(projectId);
      },

      environmentVariables: async (_: any, { projectId }: { projectId: string }) => {
        return service.getEnvironmentVariablesByProjectId(projectId);
      },

      projectMembers: async (_: any, { projectId }: { projectId: string }) => {
        return service.getProjectMembersByProjectId(projectId);
      },

      searchProjects: async (_: any, { searchText }: { searchText: string }, context: any) => {
        return service.searchProjects(context.userId, searchText);
      },

      domains: async (_:any, { projectId }: { projectId: string }) => {
        return service.getDomainsByProjectId(projectId);
      }
    },

    // TODO: Return error in GQL response
    Mutation: {
      removeProjectMember: async (_: any, { projectMemberId }: { projectMemberId: string }, context: any) => {
        try {
          const member = await db.getProjectMemberById(projectMemberId);

          if (member.member.id === context.userId) {
            throw new Error('Invalid operation: cannot remove self');
          }

          const memberProject = member.project;
          assert(memberProject);

          if (isUserOwner(String(context.userId), String(memberProject.owner.id))) {
            return await db.removeProjectMemberById(projectMemberId);
          } else {
            throw new Error('Invalid operation: not authorized');
          }
        } catch (err) {
          log(err);
          return false;
        }
      },

      updateProjectMember: async (_: any, { projectMemberId, data }: {
        projectMemberId: string,
        data: {
          permissions: Permission[]
        }
      }) => {
        try {
          return await db.updateProjectMemberById(projectMemberId, data);
        } catch (err) {
          log(err);
          return false;
        }
      },

      addProjectMember: async (_: any, { projectId, data }: {
        projectId: string,
        data: {
          email: string,
          permissions: Permission[]
        }
      }) => {
        try {
          // TODO: Send invitation
          return await db.addProjectMember(projectId, data);
        } catch (err) {
          log(err);
          return false;
        }
      },

      addEnvironmentVariables: async (_: any, { projectId, environmentVariables }: { projectId: string, environmentVariables: { environments: string[], key: string, value: string}[] }) => {
        try {
          return await db.addEnvironmentVariablesByProjectId(projectId, environmentVariables);
        } catch (err) {
          log(err);
          return false;
        }
      },

      updateEnvironmentVariable: async (_: any, { environmentVariableId, environmentVariable }: { environmentVariableId: string, environmentVariable : {
        key: string
        value: string
      }}) => {
        try {
          return await db.updateEnvironmentVariable(environmentVariableId, environmentVariable);
        } catch (err) {
          log(err);
          return false;
        }
      },

      removeEnvironmentVariable: async (_: any, { environmentVariableId }: { environmentVariableId: string}) => {
        try {
          return await db.deleteEnvironmentVariable(environmentVariableId);
        } catch (err) {
          log(err);
          return false;
        }
      },

      updateDeploymentToProd: async (_: any, { deploymentId }: { deploymentId: string }) => {
        try {
          return await db.updateDeploymentById(deploymentId, {
            environment: Environment.Production
          });
        } catch (err) {
          log(err);
          return false;
        }
      },

      addProject: async (_: any, { projectDetails }: { projectDetails: DeepPartial<Project> }, context: any) => {
        try {
          await db.addProject(context.userId, projectDetails);
          return true;
        } catch (err) {
          log(err);
          return false;
        }
      },

      updateProject: async (_: any, { projectId, projectDetails }: { projectId: string, projectDetails: DeepPartial<Project> }) => {
        try {
          return await db.updateProjectById(projectId, projectDetails);
        } catch (err) {
          log(err);
          return false;
        }
      },

      redeployToProd: async (_: any, { deploymentId }: { deploymentId: string }, context: any) => {
        try {
          return await db.redeployToProdById(context.userId, deploymentId);
        } catch (err) {
          log(err);
          return false;
        }
      },

      deleteProject: async (_: any, { projectId }: { projectId: string }) => {
        try {
          return await db.deleteProjectById(projectId);
        } catch (err) {
          log(err);
          return false;
        }
      },

      deleteDomain: async (_: any, { domainId }: { domainId: string }) => {
        try {
          return await db.deleteDomainById(domainId);
        } catch (err) {
          log(err);
          return false;
        }
      },

      rollbackDeployment: async (_: any, { projectId, deploymentId }: {deploymentId: string, projectId: string }) => {
        try {
          return await db.rollbackDeploymentById(projectId, deploymentId);
        } catch (err) {
          log(err);
          return false;
        }
      },

      addDomain: async (_: any, { projectId, domainDetails }: { projectId: string, domainDetails: { name: string } }) => {
        try {
          return await db.addDomainByProjectId(projectId, domainDetails);
        } catch (err) {
          log(err);
          return false;
        }
      },

      updateDomain: async (_: any, { domainId, domainDetails }: { domainId: string, domainDetails: DeepPartial<Domain>}) => {
        try {
          return await db.updateDomainById(domainId, domainDetails);
        } catch (err) {
          log(err);
          return false;
        }
      },

      authenticateGitHub: async (_: any, { code }: { code: string }, context: any) => {
        // TOO: Move to Service class
        const { authentication: { token } } = await app.createToken({
          code
        });

        await db.updateUser(context.userId, { gitHubToken: token });

        return { token };
      },

      unauthenticateGitHub: async (_: any, __: object, context: any) => {
        try {
          return db.updateUser(context.userId, { gitHubToken: null });
        } catch (err) {
          log(err);
          return false;
        }
      }
    }
  };
};
