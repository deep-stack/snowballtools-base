import debug from 'debug';
import { DeepPartial, FindOptionsWhere } from 'typeorm';

import { Service } from './service';
import { Permission } from './entity/ProjectMember';
import { Domain } from './entity/Domain';
import { Project } from './entity/Project';
import { EnvironmentVariable } from './entity/EnvironmentVariable';

const log = debug('snowball:resolver');

export const createResolvers = async (service: Service): Promise<any> => {
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

      projectsInOrganization: async (_: any, { organizationSlug }: {organizationSlug: string }, context: any) => {
        return service.getProjectsInOrganization(context.userId, organizationSlug);
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

      domains: async (_:any, { projectId, filter }: { projectId: string, filter?: FindOptionsWhere<Domain> }) => {
        return service.getDomainsByProjectId(projectId, filter);
      }
    },

    // TODO: Return error in GQL response
    Mutation: {
      removeProjectMember: async (_: any, { projectMemberId }: { projectMemberId: string }, context: any) => {
        try {
          return await service.removeProjectMember(context.userId, projectMemberId);
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
          return await service.updateProjectMember(projectMemberId, data);
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
          return Boolean(await service.addProjectMember(projectId, data));
        } catch (err) {
          log(err);
          return false;
        }
      },

      addEnvironmentVariables: async (_: any, { projectId, data }: { projectId: string, data: { environments: string[], key: string, value: string}[] }) => {
        try {
          return Boolean(await service.addEnvironmentVariables(projectId, data));
        } catch (err) {
          log(err);
          return false;
        }
      },

      updateEnvironmentVariable: async (_: any, { environmentVariableId, data }: { environmentVariableId: string, data : DeepPartial<EnvironmentVariable>}) => {
        try {
          return await service.updateEnvironmentVariable(environmentVariableId, data);
        } catch (err) {
          log(err);
          return false;
        }
      },

      removeEnvironmentVariable: async (_: any, { environmentVariableId }: { environmentVariableId: string}) => {
        try {
          return await service.removeEnvironmentVariable(environmentVariableId);
        } catch (err) {
          log(err);
          return false;
        }
      },

      updateDeploymentToProd: async (_: any, { deploymentId }: { deploymentId: string }, context: any) => {
        try {
          return Boolean(await service.updateDeploymentToProd(context.userId, deploymentId));
        } catch (err) {
          log(err);
          return false;
        }
      },

      addProject: async (_: any, { organizationSlug, data }: { organizationSlug: string, data: DeepPartial<Project> }, context: any) => {
        try {
          return await service.addProject(context.userId, organizationSlug, data);
        } catch (err) {
          log(err);
          throw err;
        }
      },

      updateProject: async (_: any, { projectId, projectDetails }: { projectId: string, projectDetails: DeepPartial<Project> }) => {
        try {
          return await service.updateProject(projectId, projectDetails);
        } catch (err) {
          log(err);
          return false;
        }
      },

      redeployToProd: async (_: any, { deploymentId }: { deploymentId: string }, context: any) => {
        try {
          return Boolean(await service.redeployToProd(context.userId, deploymentId));
        } catch (err) {
          log(err);
          return false;
        }
      },

      deleteProject: async (_: any, { projectId }: { projectId: string }) => {
        try {
          return await service.deleteProject(projectId);
        } catch (err) {
          log(err); return false;
        }
      },

      deleteDomain: async (_: any, { domainId }: { domainId: string }) => {
        try {
          return await service.deleteDomain(domainId);
        } catch (err) {
          log(err);
          return false;
        }
      },

      rollbackDeployment: async (_: any, { projectId, deploymentId }: {deploymentId: string, projectId: string }) => {
        try {
          return await service.rollbackDeployment(projectId, deploymentId);
        } catch (err) {
          log(err);
          return false;
        }
      },

      addDomain: async (_: any, { projectId, domainDetails }: { projectId: string, domainDetails: { name: string } }) => {
        try {
          return Boolean(await service.addDomain(projectId, domainDetails));
        } catch (err) {
          log(err);
          return false;
        }
      },

      updateDomain: async (_: any, { domainId, domainDetails }: { domainId: string, domainDetails: DeepPartial<Domain>}) => {
        try {
          return await service.updateDomain(domainId, domainDetails);
        } catch (err) {
          log(err);
          return false;
        }
      },

      authenticateGitHub: async (_: any, { code }: { code: string }, context: any) => {
        try {
          return await service.authenticateGitHub(code, context.userId);
        } catch (err) {
          log(err);
          return false;
        }
      },

      unauthenticateGitHub: async (_: any, __: object, context: any) => {
        try {
          return service.unauthenticateGitHub(context.userId, { gitHubToken: null });
        } catch (err) {
          log(err);
          return false;
        }
      }
    }
  };
};
