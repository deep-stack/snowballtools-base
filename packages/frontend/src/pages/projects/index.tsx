import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';

import { Button, Typography, Chip } from '@material-tailwind/react';

import ProjectCard from '../../components/projects/ProjectCard';
import { ProjectSearchOutletContext } from '../../types/project';

const Projects = () => {
  const { projects } = useOutletContext<ProjectSearchOutletContext>();

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
          projects.map((project: any, key: number) => {
            return <ProjectCard project={project} key={key} />;
          })}
      </div>
    </div>
  );
};

export default Projects;
