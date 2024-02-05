import debug from 'debug';
import assert from 'assert';
import { DeepPartial } from 'typeorm';

import { OAuthApp } from '@octokit/oauth-app';

import { Service } from './service';
import { Database } from './database';
import { isUserOwner } from './utils';
import { Permission } from './entity/ProjectMember';
import { Domain } from './entity/Domain';
import { Project } from './entity/Project';
import { EnvironmentVariable } from './entity/EnvironmentVariable';

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
        return service.updateProjectMember(projectMemberId, data);
      },

      addProjectMember: async (_: any, { projectId, data }: {
        projectId: string,
        data: {
          email: string,
          permissions: Permission[]
        }
      }) => {
        return service.addProjectMember(projectId, data);
      },

      addEnvironmentVariables: async (_: any, { projectId, data }: { projectId: string, data: { environments: string[], key: string, value: string}[] }) => {
        return service.addEnvironmentVariables(projectId, data);
      },

      updateEnvironmentVariable: async (_: any, { environmentVariableId, data }: { environmentVariableId: string, data : DeepPartial<EnvironmentVariable>}) => {
        return service.updateEnvironmentVariable(environmentVariableId, data);
      },

      removeEnvironmentVariable: async (_: any, { environmentVariableId }: { environmentVariableId: string}) => {
        return service.removeEnvironmentVariable(environmentVariableId);
      },

      updateDeploymentToProd: async (_: any, { deploymentId }: { deploymentId: string }) => {
        return service.updateDeploymentToProd(deploymentId);
      },

      addProject: async (_: any, { data }: { data: DeepPartial<Project> }, context: any) => {
        return service.addProject(context.userId, data);
      },

      updateProject: async (_: any, { projectId, projectDetails }: { projectId: string, projectDetails: DeepPartial<Project> }) => {
        return service.updateProject(projectId, projectDetails);
      },

      redeployToProd: async (_: any, { deploymentId }: { deploymentId: string }, context: any) => {
        return service.redeployToProd(context.userId, deploymentId);
      },

      deleteProject: async (_: any, { projectId }: { projectId: string }) => {
        return service.deleteProject(projectId);
      },

      deleteDomain: async (_: any, { domainId }: { domainId: string }) => {
        return service.deleteDomain(domainId);
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
