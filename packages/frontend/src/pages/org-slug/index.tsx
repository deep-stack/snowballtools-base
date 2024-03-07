import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Project } from 'gql-client';
import { Button } from 'components/shared/Button';

import { PlusIcon } from 'components/shared/CustomIcon';
import { ProjectCard } from 'components/projects/ProjectCard';
import { Heading } from 'components/shared/Heading';
import { Badge } from 'components/shared/Badge';
import { useGQLClient } from 'context/GQLClientContext';

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
    <section className="px-4 md:px-6 py-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center">
        <div className="grow">
          <div className="flex gap-4 items-center">
            <Heading as="h2" className="text-[24px]">
              Projects
            </Heading>
            <Badge className="bg-base-bg-alternate text-elements-mid-em h-7 w-7">
              {projects.length}
            </Badge>
          </div>
        </div>
        <Link to="projects/create">
          <Button leftIcon={<PlusIcon />}>Create project</Button>
        </Link>
      </div>
      {/* List of projects */}
      <div className="grid grid-flow-row grid-cols-[repeat(auto-fill,_minmax(280px,_1fr))] gap-4">
        {projects.length > 0 &&
          projects.map((project, key) => {
            return <ProjectCard project={project} key={key} />;
          })}
      </div>
    </section>
  );
};

export default Projects;
