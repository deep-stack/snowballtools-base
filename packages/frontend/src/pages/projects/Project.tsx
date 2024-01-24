import React, { useMemo } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';

import { Button, Typography } from '@material-tailwind/react';

import HorizontalLine from '../../components/HorizontalLine';
import ProjectTabs from '../../components/projects/project/ProjectTabs';
import { ProjectsOutletContext } from '../../types/project';

const Project = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { projects } = useOutletContext<ProjectsOutletContext>();

  const project = useMemo(() => {
    return projects.find((project) => {
      return project.id === id;
    });
  }, [id, projects]);

  return (
    <div className="h-full">
      {project ? (
        <>
          <div className="flex p-4 gap-4 items-center">
            <Button
              variant="outlined"
              className="rounded-full"
              onClick={() => navigate(-1)}
            >
              {'<'}
            </Button>
            <Typography variant="h3" className="grow">
              {project?.title}
            </Typography>
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
