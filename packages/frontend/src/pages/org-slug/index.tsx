import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Project } from 'gql-client';
import { Button } from 'components/shared/Button';

import { Typography, Chip } from '@material-tailwind/react';

import ProjectCard from '../../components/projects/ProjectCard';
import { useGQLClient } from '../../context/GQLClientContext';
import { PlusIcon } from 'components/shared/CustomIcon';

const Projects = () => {
  const client = useGQLClient();
  const { orgSlug } = useParams();
  const [projects, setProjects] = useState<Project[]>([]);

  const fetchProjects = useCallback(async () => {
    const { projectsInOrganization } = await client.getProjectsInOrganization(
      orgSlug!,
    );
    setProjects(projectsInOrganization);
  }, [orgSlug]);

  useEffect(() => {
    fetchProjects();
  }, [orgSlug]);

  return (
    <div>
      <div className="flex p-5">
        <div className="grow">
          <div className="flex gap-2 items-center">
            <Typography variant="h4" placeholder={''}>
              Projects
            </Typography>
            <Chip
              className="bg-gray-300 rounded-full static"
              value={projects.length}
              size="sm"
            />
          </div>
        </div>
        <div>
          <Link to="projects/create">
            <Button leftIcon={<PlusIcon />}>Create project</Button>
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
