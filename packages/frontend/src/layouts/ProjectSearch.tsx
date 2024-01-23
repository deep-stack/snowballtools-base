import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import HorizontalLine from '../components/HorizontalLine';
import { IconButton, Typography } from '@material-tailwind/react';
import ProjectSearchBar from '../components/projects/ProjectSearchBar';
import { useGQLClient } from '../context/GQLClientContext';
import { Environments, ProjectDetails } from '../types/project';

const ProjectSearch = () => {
  const client = useGQLClient();
  const [projects, setProjects] = useState<ProjectDetails[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await client.getOrganizations();

      // Note: select first organization as organization switching not yet implemented
      const projects = res.organizations[0]?.projects || [];
      const orgName = res.organizations[0]?.name || '';

      const updatedProjectsPromises = projects.map(async (project: any) => {
        const { deployments } = await client.getDeployments(String(project.id));
        const updatedDeployments = deployments.map((deployment: any) => {
          return {
            ...deployment,
            isProduction: deployment.environment === Environments.PRODUCTION,
            author: '',
            commit: {
              hash: '',
              message: '',
            },
            domain: deployment.domain
              ? {
                  ...deployment.domain,
                  record: {
                    type: '',
                    name: '',
                    value: '',
                  },
                  isRedirectedto: deployment.domain.isRedirected,
                }
              : null,
          };
        });

        return {
          ...project,
          // TODO: populate empty fields
          icon: '',
          title: project.name,
          organization: orgName,
          deployments: updatedDeployments,
          url: '',
          domain: null,
          createdBy: project.owner.name,
          source: '',
          repositoryId: 0,
          repositories: [
            {
              id: 0,
              title: project.repository,
              updatedAt: '',
              user: '',
              private: false,
              branch: [''],
            },
          ],
          // TODO: populate from github API
          latestCommit: {
            message: '',
            createdAt: '',
            branch: '',
          },
        };
      });

      const updatedProjects = await Promise.all(updatedProjectsPromises);
      setProjects(updatedProjects);
    };

    fetch();
  }, [client]);

  return (
    <div>
      <div className="sticky top-0 bg-white z-30">
        <div className="flex p-5">
          <div className="grow mr-2">
            <ProjectSearchBar onChange={() => {}} projects={projects} />
          </div>
          <IconButton color="blue" className="rounded-full mr-2">
            <Typography variant="h5">+</Typography>
          </IconButton>
          <div className="mr-2 flex items-center">
            <Typography>^</Typography>
          </div>
          <div className="px-2 py-1 bg-blue-gray-50 rounded-lg">
            <Typography variant="lead">SY</Typography>
          </div>
        </div>
        <HorizontalLine />
      </div>
      <div className="z-0">
        <Outlet context={{ projects }} />
      </div>
    </div>
  );
};

export default ProjectSearch;
