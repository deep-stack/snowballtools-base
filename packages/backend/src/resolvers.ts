import debug from 'debug';
import { DeepPartial, FindOptionsWhere } from 'typeorm';

import { Service } from './service';
import { Permission } from './entity/ProjectMember';
import { Domain } from './entity/Domain';
import { Project } from './entity/Project';
import { EnvironmentVariable } from './entity/EnvironmentVariable';
import { AddProjectFromTemplateInput, AuctionParams, EnvironmentVariables } from './types';

const log = debug('snowball:resolver');

export const createResolvers = async (service: Service): Promise<any> => {
  return {
    Query: {
      // TODO: add custom type for context
      user: (_: any, __: any, context: any) => {
        return context.user;
      },

      organizations: async (_: any, __: any, context: any) => {
        return service.getOrganizationsByUserId(context.user);
      },

      project: async (_: any, { projectId }: { projectId: string }) => {
        return service.getProjectById(projectId);
      },

      projectsInOrganization: async (
        _: any,
        { organizationSlug }: { organizationSlug: string },
        context: any,
      ) => {
        return service.getProjectsInOrganization(
          context.user,
          organizationSlug,
        );
      },

      deployments: async (_: any, { projectId }: { projectId: string }) => {
        return service.getDeploymentsByProjectId(projectId);
      },

      environmentVariables: async (
        _: any,
        { projectId }: { projectId: string },
      ) => {
        return service.getEnvironmentVariablesByProjectId(projectId);
      },

      projectMembers: async (_: any, { projectId }: { projectId: string }) => {
        return service.getProjectMembersByProjectId(projectId);
      },

      searchProjects: async (
        _: any,
        { searchText }: { searchText: string },
        context: any,
      ) => {
        return service.searchProjects(context.user, searchText);
      },

      domains: async (
        _: any,
        {
          projectId,
          filter,
        }: { projectId: string; filter?: FindOptionsWhere<Domain> },
      ) => {
        return service.getDomainsByProjectId(projectId, filter);
      },

      getAuctionData: async (
        _: any,
        { auctionId }: { auctionId: string },
      ) => {
        return service.getAuctionData(auctionId);
      },
    },

    // TODO: Return error in GQL response
    Mutation: {
      removeProjectMember: async (
        _: any,
        { projectMemberId }: { projectMemberId: string },
        context: any,
      ) => {
        try {
          return await service.removeProjectMember(
            context.user,
            projectMemberId,
          );
        } catch (err) {
          log(err);
          return false;
        }
      },

      updateProjectMember: async (
        _: any,
        {
          projectMemberId,
          data,
        }: {
          projectMemberId: string;
          data: {
            permissions: Permission[];
          };
        },
      ) => {
        try {
          return await service.updateProjectMember(projectMemberId, data);
        } catch (err) {
          log(err);
          return false;
        }
      },

      addProjectMember: async (
        _: any,
        {
          projectId,
          data,
        }: {
          projectId: string;
          data: {
            email: string;
            permissions: Permission[];
          };
        },
      ) => {
        try {
          return Boolean(await service.addProjectMember(projectId, data));
        } catch (err) {
          log(err);
          return false;
        }
      },

      addEnvironmentVariables: async (
        _: any,
        {
          projectId,
          data,
        }: {
          projectId: string;
          data: { environments: string[]; key: string; value: string }[];
        },
      ) => {
        try {
          return Boolean(
            await service.addEnvironmentVariables(projectId, data),
          );
        } catch (err) {
          log(err);
          return false;
        }
      },

      updateEnvironmentVariable: async (
        _: any,
        {
          environmentVariableId,
          data,
        }: {
          environmentVariableId: string;
          data: DeepPartial<EnvironmentVariable>;
        },
      ) => {
        try {
          return await service.updateEnvironmentVariable(
            environmentVariableId,
            data,
          );
        } catch (err) {
          log(err);
          return false;
        }
      },

      removeEnvironmentVariable: async (
        _: any,
        { environmentVariableId }: { environmentVariableId: string },
      ) => {
        try {
          return await service.removeEnvironmentVariable(environmentVariableId);
        } catch (err) {
          log(err);
          return false;
        }
      },

      updateDeploymentToProd: async (
        _: any,
        { deploymentId }: { deploymentId: string },
        context: any,
      ) => {
        try {
          return Boolean(
            await service.updateDeploymentToProd(context.user, deploymentId),
          );
        } catch (err) {
          log(err);
          return false;
        }
      },

      addProjectFromTemplate: async (
        _: any,
        {
          organizationSlug,
          data,
          lrn,
          auctionParams,
          environmentVariables
        }: {
          organizationSlug: string;
          data: AddProjectFromTemplateInput;
          lrn: string;
          auctionParams: AuctionParams,
          environmentVariables: EnvironmentVariables[];
        },
        context: any,
      ) => {
        try {
          return await service.addProjectFromTemplate(
            context.user,
            organizationSlug,
            data,
            lrn,
            auctionParams,
            environmentVariables
          );
        } catch (err) {
          log(err);
          throw err;
        }
      },

      addProject: async (
        _: any,
        {
          organizationSlug,
          data,
          lrn,
          auctionParams,
          environmentVariables
        }: {
          organizationSlug: string;
          data: DeepPartial<Project>;
          lrn: string;
          auctionParams: AuctionParams,
          environmentVariables: EnvironmentVariables[];
        },
        context: any,
      ) => {
        try {
          return await service.addProject(
            context.user,
            organizationSlug,
            data,
            lrn,
            auctionParams,
            environmentVariables
          );
        } catch (err) {
          log(err);
          throw err;
        }
      },

      updateProject: async (
        _: any,
        { projectId, data }: { projectId: string; data: DeepPartial<Project> },
      ) => {
        try {
          return await service.updateProject(projectId, data);
        } catch (err) {
          log(err);
          return false;
        }
      },

      redeployToProd: async (
        _: any,
        { deploymentId }: { deploymentId: string },
        context: any,
      ) => {
        try {
          return Boolean(
            await service.redeployToProd(context.user, deploymentId),
          );
        } catch (err) {
          log(err);
          return false;
        }
      },

      deleteProject: async (_: any, { projectId }: { projectId: string }) => {
        try {
          return await service.deleteProject(projectId);
        } catch (err) {
          log(err);
          return false;
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

      rollbackDeployment: async (
        _: any,
        {
          projectId,
          deploymentId,
        }: { deploymentId: string; projectId: string },
      ) => {
        try {
          return await service.rollbackDeployment(projectId, deploymentId);
        } catch (err) {
          log(err);
          return false;
        }
      },

      deleteDeployment: async (
        _: any,
        { deploymentId }: { deploymentId: string },
      ) => {
        try {
          return await service.deleteDeployment(deploymentId);
        } catch (err) {
          log(err);
          return false;
        }
      },

      addDomain: async (
        _: any,
        { projectId, data }: { projectId: string; data: { name: string } },
      ) => {
        try {
          return Boolean(await service.addDomain(projectId, data));
        } catch (err) {
          log(err);
          return false;
        }
      },

      updateDomain: async (
        _: any,
        { domainId, data }: { domainId: string; data: DeepPartial<Domain> },
      ) => {
        try {
          return await service.updateDomain(domainId, data);
        } catch (err) {
          log(err);
          return false;
        }
      },

      authenticateGitHub: async (
        _: any,
        { code }: { code: string },
        context: any,
      ) => {
        try {
          return await service.authenticateGitHub(code, context.user);
        } catch (err) {
          log(err);
          return false;
        }
      },

      unauthenticateGitHub: async (_: any, __: object, context: any) => {
        try {
          return service.unauthenticateGitHub(context.user, {
            gitHubToken: null,
          });
        } catch (err) {
          log(err);
          return false;
        }
      },
    },
  };
};
