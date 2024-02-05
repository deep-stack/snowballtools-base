import React, { useCallback, useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { Organization } from 'gql-client';

import { Button, Typography, Chip } from '@material-tailwind/react';

import ProjectCard from '../components/projects/ProjectCard';
import { useGQLClient } from '../context/GQLClientContext';
import { ProjectDetails } from '../types/project';
import { COMMIT_DETAILS } from '../constants';

const Projects = () => {
  const client = useGQLClient();
  const organization = useOutletContext<Organization>();

  const [projects, setProjects] = useState<ProjectDetails[]>([]);

  const fetchProjects = useCallback(async () => {
    const { projectsInOrganization } = await client.getProjectsInOrganization(
      organization.id,
    );

    const updatedProjects = projectsInOrganization.map((project) => {
      return {
        ...project,
        // TODO: Populate from github API
        latestCommit: COMMIT_DETAILS,
      };
    });

    setProjects(updatedProjects);
  }, []);

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div>
      <div className="flex p-5">
        <div className="grow">
          <div className="flex gap-2 items-center">
            <Typography variant="h4">Projects</Typography>
            <Chip
              className="bg-gray-300 rounded-full static"
              value={projects.length}
              size="sm"
            />
          </div>
        </div>
        <div>
          <Link to="/projects/create">
            <Button className="rounded-full" color="blue">
              Create project
            </Button>
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-5 p-5">
        {projects.length !== 0 &&
          projects.map((project, key) => {
            return <ProjectCard project={project} key={key} />;
          })}
      </div>
    </div>
  );
};

export default Projects;
