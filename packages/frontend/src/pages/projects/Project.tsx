import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import HorizontalLine from '../../components/HorizontalLine';
import projects from '../../assets/projects.json';
import ProjectTabs from '../../components/Tab';

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
            <button onClick={() => navigate(-1)}>{'<'}</button>
            <h3 className="grow">{project?.title} </h3>
            <button>Open Repo</button>
            <button>Go to app</button>
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
