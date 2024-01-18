import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import HorizontalLine from '../components/HorizontalLine';
import { IconButton, Typography } from '@material-tailwind/react';
import ProjectSearchBar from '../components/projects/ProjectSearchBar';
import { useGQLClient } from '../context/GQLClientContext';
import { ProjectDetails } from '../types/project';

const ProjectSearch = () => {
  const client = useGQLClient();
  const [projects, setProjects] = useState<ProjectDetails[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await client.getOrganizations();

      // Note: select first organization as organization switching not yet implemented
      const projects = res.organizations[0].projects;
      const orgName = res.organizations[0].name;

      const updatedProjects = projects.map((project: any) => {
        return {
          ...project,
          // TODO: populate empty fields
          icon: '',
          title: project.name,
          organization: orgName,
          url: '',
          domain: null,
          createdBy: project.owner.name,
          source: '',
          repositoryId: project.repository,
          // TODO: populate from github API
          latestCommit: {
            message: '',
            createdAt: '',
            branch: '',
          },
        };
      });

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
