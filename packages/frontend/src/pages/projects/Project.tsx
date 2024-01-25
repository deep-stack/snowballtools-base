import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { Button, Typography } from '@material-tailwind/react';

import { Project as ProjectType } from 'gql-client';

import HorizontalLine from '../../components/HorizontalLine';
import ProjectTabs from '../../components/projects/project/ProjectTabs';
import { useGQLClient } from '../../context/GQLClientContext';
import { ProjectSearchOutletContext } from '../../types/project';

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

  // TODO: Remove organization projects
  const { projects: organizationProjects } =
    useOutletContext<ProjectSearchOutletContext>();

  const organizationProject = useMemo(() => {
    return organizationProjects.find((project) => {
      return project.id === id;
    });
  }, [id, organizationProjects]);

  return (
    <div className="h-full">
      {project && organizationProject ? (
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
            <ProjectTabs
              project={project}
              organizationProject={organizationProject}
              onUpdate={onUpdate}
            />
          </div>
        </>
      ) : (
        <h4>Project not found</h4>
      )}
    </div>
  );
};

export default Project;
