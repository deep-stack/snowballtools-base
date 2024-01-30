import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Project as ProjectType } from 'gql-client';

import { Button, Typography } from '@material-tailwind/react';

import HorizontalLine from '../../components/HorizontalLine';
import ProjectTabs from '../../components/projects/project/ProjectTabs';
import { useGQLClient } from '../../context/GQLClientContext';

const Project = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const client = useGQLClient();

  const [project, setProject] = useState<ProjectType | null>(null);

  const fetchProject = useCallback(async (id: string | undefined) => {
    if (id) {
      const { project } = await client.getProject(id);
      setProject(project);
    }
  }, []);

  useEffect(() => {
    fetchProject(id);
  }, [id]);

  const onUpdate = async () => {
    await fetchProject(id);
  };

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
              {project?.name}
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
            <ProjectTabs project={project} onUpdate={onUpdate} />
          </div>
        </>
      ) : (
        <h4>Project not found</h4>
      )}
    </div>
  );
};

export default Project;
