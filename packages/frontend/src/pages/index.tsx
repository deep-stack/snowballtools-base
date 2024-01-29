import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { Button, Typography, Chip } from '@material-tailwind/react';

import ProjectCard from '../components/projects/ProjectCard';
import { useGQLClient } from '../context/GQLClientContext';
import { ProjectDetails } from '../types/project';

// TODO: Implement organization switcher
const USER_ORGANIZATION_ID = '1';

const Projects = () => {
  const client = useGQLClient();
  const { id } = useParams();
  const [projects, setProjects] = useState<ProjectDetails[]>([]);

  const fetchProjects = useCallback(async () => {
    const { projectsInOrganization } =
      await client.getProjectsInOrganization(USER_ORGANIZATION_ID);

    const updatedProjects = projectsInOrganization.map((project) => {
      return {
        ...project,
        // TODO: Populate from github API
        latestCommit: {
          message: 'subscription added',
          createdAt: '2023-12-11T04:20:00',
          branch: 'main',
        },
      };
    });

    setProjects(updatedProjects);
  }, [id]);

  useEffect(() => {
    fetchProjects();
  }, [id]);

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
