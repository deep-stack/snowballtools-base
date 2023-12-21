import React from 'react';
import { Link } from 'react-router-dom';

import { Button, IconButton, Typography, Chip } from '@material-tailwind/react';

import ProjectCard from '../components/projects/ProjectCard';
import HorizontalLine from '../components/HorizontalLine';
import projectsDetail from '../assets/projects.json';
import ProjectSearch from '../components/projects/ProjectSearch';

const Projects = () => {
  return (
    <div className="bg-white rounded-3xl h-full">
      <div className="flex p-4">
        <div className="grow mr-2">
          <ProjectSearch onChange={() => {}} />
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
      <div className="flex p-5">
        <div className="grow">
          <div className="flex gap-2 items-center">
            <Typography variant="h4">Projects</Typography>
            <Chip
              className="bg-gray-300 rounded-full static"
              value={projectsDetail.length}
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
        {projectsDetail.map((project, key) => {
          return <ProjectCard project={project} key={key} />;
        })}
      </div>
    </div>
  );
};

export default Projects;
