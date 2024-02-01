import debug from 'debug';
import assert from 'assert';
import { DeepPartial } from 'typeorm';

import { OAuthApp } from '@octokit/oauth-app';

import { Database } from './database';
import { deploymentToGqlType, projectMemberToGqlType, projectToGqlType, environmentVariableToGqlType, isUserOwner } from './utils';
import { Environment } from './entity/Deployment';
import { Permission } from './entity/ProjectMember';
import { Domain } from './entity/Domain';

const log = debug('snowball:database');

export const createResolvers = async (db: Database, app: OAuthApp): Promise<any> => {
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

      project: async (_: any, { projectId }: { projectId: string }) => {
        const dbProject = await db.getProjectById(projectId);

        return dbProject || null;
      },

      projectsInOrganization: async (_: any, { organizationId }: {organizationId: string }, context: any) => {
        const dbProjects = await db.getProjectsInOrganization(context.userId, organizationId);
        return dbProjects;
      },

      deployments: async (_: any, { projectId }: { projectId: string }) => {
        const dbDeployments = await db.getDeploymentsByProjectId(projectId);

        const deployments = dbDeployments.map(dbDeployment => {
          return deploymentToGqlType(dbDeployment);
        });

        return deployments;
      },

      environmentVariables: async (_: any, { projectId }: { projectId: string }) => {
        const dbEnvironmentVariables = await db.getEnvironmentVariablesByProjectId(projectId);
        return dbEnvironmentVariables;
      },

      projectMembers: async (_: any, { projectId }: { projectId: string }) => {
        const dbProjectMembers = await db.getProjectMembersByProjectId(projectId);

        const projectMembers = dbProjectMembers.map(dbProjectMember => {
          return projectMemberToGqlType(dbProjectMember);
        });

        return projectMembers;
      },

      searchProjects: async (_: any, { searchText }: { searchText: string }, context: any) => {
        const dbProjects = await db.getProjectsBySearchText(context.userId, searchText);

        const projects = dbProjects.map((project) => {
          return projectToGqlType(project, [], []);
        });

        return projects;
      },

      domains: async (_:any, { projectId }: { projectId: string }) => {
        try {
          return db.getDomainsByProjectId(projectId);
        } catch (err) {
          log(err);
          return false;
        }
      }
    },

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
            return db.removeProjectMemberById(projectMemberId);
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
          return db.updateProjectMemberById(projectMemberId, data);
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
      },

      updateEnvironmentVariable: async (_: any, { environmentVariableId, environmentVariable }: { environmentVariableId: string, environmentVariable : {
        key: string
        value: string
      }}) => {
        try {
          return db.updateEnvironmentVariable(environmentVariableId, environmentVariable);
        } catch (err) {
          log(err);
          return false;
        }
      },

      removeEnvironmentVariable: async (_: any, { environmentVariableId }: { environmentVariableId: string}) => {
        try {
          return db.deleteEnvironmentVariable(environmentVariableId);
        } catch (err) {
          log(err);
          return false;
        }
      },

      updateDeploymentToProd: async (_: any, { deploymentId }: { deploymentId: string }) => {
        try {
          return db.updateDeploymentById(deploymentId, {
            environment: Environment.Production
          });
        } catch (err) {
          log(err);
          return false;
        }
      },

      updateProject: async (_: any, { projectId, projectDetails }: { projectId: string, projectDetails: { name: string, description: string } }) => {
        try {
          return db.updateProjectById(projectId, projectDetails);
        } catch (err) {
          log(err);
          return false;
        }
      },

      redeployToProd: async (_: any, { deploymentId }: { deploymentId: string }, context: any) => {
        try {
          await db.redeployToProdById(context.userId, deploymentId);
          return true;
        } catch (err) {
          log(err);
          return false;
        }
      },

      deleteProject: async (_: any, { projectId }: { projectId: string }) => {
        try {
          return db.deleteProjectById(projectId);
        } catch (err) {
          log(err);
          return false;
        }
      },

      deleteDomain: async (_: any, { domainId }: { domainId: string }) => {
        try {
          await db.deleteDomainById(domainId);
          return true;
        } catch (err) {
          log(err);
          return false;
        }
      },

      rollbackDeployment: async (_: any, { projectId, deploymentId }: {deploymentId: string, projectId: string }) => {
        try {
          return db.rollbackDeploymentById(projectId, deploymentId);
        } catch (err) {
          log(err);
          return false;
        }
      },

      addDomain: async (_: any, { projectId, domainDetails }: { projectId: string, domainDetails: { name: string } }) => {
        try {
          await db.addDomainByProjectId(projectId, domainDetails);
          return true;
        } catch (err) {
          log(err);
          return false;
        }
      },

      updateDomain: async (_: any, { domainId, domainDetails }: { domainId: string, domainDetails: DeepPartial<Domain>}) => {
        try {
          await db.updateDomainById(domainId, domainDetails);
          return true;
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
