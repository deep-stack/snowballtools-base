import React from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@material-tailwind/react';

import ProjectCard from '../components/projects/ProjectCard';
import HorizontalLine from '../components/HorizontalLine';
import projectsDetail from '../assets/projects.json';
import ProjectSearch from '../components/projects/ProjectSearch';

const Projects = () => {
  return (
    <div className="bg-white rounded-3xl h-full">
      <div className="flex p-4">
        <div className="grow">
          <ProjectSearch onChange={() => {}} />
        </div>
        <div className="text-gray-300">^</div>
        <div className="text-gray-300">^</div>
        <div className="text-gray-300">^</div>
      </div>
      <HorizontalLine />
      <div className="flex p-4">
        <div className="grow">
          <h3 className="text-gray-750 text-2xl">Projects</h3>
        </div>
        <div>
          {/* TODO: Create button component */}
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
