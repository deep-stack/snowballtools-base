import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Button, Typography, Chip } from '@material-tailwind/react';

import ProjectCard from '../components/projects/ProjectCard';
import projectsDetail from '../assets/projects.json';
import { useGQLClient } from '../context/GQLClientContext';

const Projects = () => {
  const client = useGQLClient();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchOrganization = async () => {
      const res = await client.getOrganizations();

      // Note: select first organization as organization switching not yet implemented
      const projects = res.organizations[0].projects;

      const updatedProjects = projects.map((project: any) => {
        return {
          ...project,
          // TODO: populate empty fields
          icon: '',
          title: '',
          organization: '',
          url: '',
          domain: null,
          createdBy: '',
          source: '',
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

    fetchOrganization();
  }, [client]);

  return (
    <div>
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
        {projects.length !== 0 &&
          projects.map((project, key) => {
            return <ProjectCard project={project} key={key} />;
          })}
      </div>
    </div>
  );
};

export default Projects;
