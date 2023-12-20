import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '@material-tailwind/react';

import HorizontalLine from '../../components/HorizontalLine';
import projects from '../../assets/projects.json';
import ProjectTabs from '../../components/projects/project/ProjectTabs';

const getProject = (id: number) => {
  return projects.find((project) => {
    return project.id === id;
  });
};

const Project = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = useMemo(() => getProject(Number(id)), [id]);

  return (
    <div className="bg-white rounded-3xl h-full">
      {project ? (
        <>
          <div className="flex p-4 gap-4">
            <Button
              variant="outlined"
              className="rounded-full"
              onClick={() => navigate(-1)}
            >
              {'<'}
            </Button>
            <h3 className="grow">{project?.title} </h3>
            <Button className="rounded-full" variant="outlined">
              Open Repo
            </Button>
            <Button className="rounded-full" color="blue">
              Go to app
            </Button>
          </div>
          <HorizontalLine />
          <div className="p-4">
            <ProjectTabs project={project} />
          </div>
        </>
      ) : (
        <h4>Project not found</h4>
      )}
    </div>
  );
};

export default Project;
