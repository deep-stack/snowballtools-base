import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { GitType, Project as ProjectType } from 'gql-client';
import { GitClient } from 'git-client';

import { useGQLClient } from '../../../context/GQLClientContext';
import { Button } from 'components/shared/Button';
import { ChevronLeft } from 'components/shared/CustomIcon';
import { WavyBorder } from 'components/shared/WavyBorder';
import { Heading } from 'components/shared/Heading';
import { Tabs } from 'components/shared/Tabs';
import { useGitClient } from 'context/GitClientContext';

const Id = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const client = useGQLClient();
  const location = useLocation();
  const { gitHubClient, giteaClient } = useGitClient();
  const [project, setProject] = useState<ProjectType | null>(null);
  const [repoUrl, setRepoUrl] = useState('');

  const fetchProject = useCallback(async (id: string | undefined) => {
    if (id) {
      const { project } = await client.getProject(id);
      setProject(project);

      if (project) {
        let gitClient: GitClient | undefined;

        if (project.gitType === GitType.GitHub) {
          gitClient = gitHubClient;
        } else if (project.gitType === GitType.Gitea) {
          gitClient = giteaClient;
        }

        const [owner, repo] = project.repository.split('/');

        const repoUrl = (await gitClient?.getRepo(owner, repo)).html_url;
        setRepoUrl(repoUrl);
      }
    }
  }, []);

  const currentTab = useMemo(() => {
    if (id) {
      const regex = /projects\/[^/]+\/([^/]+)/;
      const match = location.pathname.match(regex);
      return match ? match[1] : '';
    } else {
      return '';
    }
  }, [location, id]);

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
          <div className="px-6 py-4 flex justify-between items-center gap-4">
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="tertiary"
                className="rounded-full h-11 w-11 p-0"
                aria-label="Go back"
                leftIcon={<ChevronLeft />}
                onClick={() => navigate(-1)}
              />
              <Heading className="text-2xl font-medium">
                {project?.name}
              </Heading>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Link to={repoUrl} target="_blank">
                <Button className="h-11 transition-colors" variant="tertiary">
                  Open repo
                </Button>
              </Link>
              <Button className="h-11 transition-colors">Go to app</Button>
            </div>
          </div>
          <WavyBorder />
          <div className="px-6 ">
            <Tabs value={currentTab} className="flex-col pt-6">
              <Tabs.List>
                <Tabs.Trigger value="">
                  <Link to="">Overview</Link>
                </Tabs.Trigger>
                <Tabs.Trigger value="deployments">
                  <Link to="deployments">Deployments</Link>
                </Tabs.Trigger>
                <Tabs.Trigger value="database">
                  <Link to="database">Database</Link>
                </Tabs.Trigger>
                <Tabs.Trigger value="integrations">
                  <Link to="integrations">Integrations</Link>
                </Tabs.Trigger>
                <Tabs.Trigger value="settings">
                  <Link to="settings">Settings</Link>
                </Tabs.Trigger>
              </Tabs.List>
              {/* Not wrapping in Tab.Content because we are using Outlet */}
              <div className="py-7">
                <Outlet context={{ project, onUpdate }} />
              </div>
            </Tabs>
          </div>
        </>
      ) : (
        <div className="grid place-items-center h-[calc(100vh-174px)]">
          <Heading as="h4" className="text-2xl font-medium">
            Project not found.
          </Heading>
        </div>
      )}
    </div>
  );
};

export default Id;
