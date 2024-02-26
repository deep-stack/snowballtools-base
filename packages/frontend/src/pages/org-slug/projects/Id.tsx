import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { Project as ProjectType } from 'gql-client';

import {
  Button,
  Tab,
  Tabs,
  TabsBody,
  TabsHeader,
  Typography,
} from '@material-tailwind/react';

import HorizontalLine from '../../../components/HorizontalLine';
import { useGQLClient } from '../../../context/GQLClientContext';
import { useOctokit } from '../../../context/OctokitContext';

const Id = () => {
  const { id } = useParams();
  const { octokit } = useOctokit();
  const navigate = useNavigate();
  const client = useGQLClient();
  const location = useLocation();

  const [project, setProject] = useState<ProjectType | null>(null);
  const [repoUrl, setRepoUrl] = useState('');

  const fetchProject = useCallback(async (id: string | undefined) => {
    if (id) {
      const { project } = await client.getProject(id);
      setProject(project);

      if (project) {
        const [owner, repo] = project.repository.split('/');
        const { data: repoDetails } = await octokit.rest.repos.get({
          owner,
          repo,
        });
        setRepoUrl(repoDetails.html_url);
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
          <div className="flex p-4 gap-4 items-center">
            <Button
              variant="outlined"
              className="rounded-full"
              onClick={() => navigate(-1)}
              placeholder={''}
            >
              {'<'}
            </Button>
            <Typography variant="h3" className="grow" placeholder={''}>
              {project?.name}
            </Typography>
            <Link to={repoUrl} target="_blank">
              <Button
                className="rounded-full"
                variant="outlined"
                placeholder={''}
              >
                Open Repo
              </Button>
            </Link>
            <Button className="rounded-full" color="blue" placeholder={''}>
              Go to app
            </Button>
          </div>
          <HorizontalLine />
          <div className="p-4">
            <Tabs value={currentTab}>
              <TabsHeader
                className="rounded-none border-b border-blue-gray-50 bg-transparent p-0"
                indicatorProps={{
                  className:
                    'bg-transparent border-b-2 border-gray-900 shadow-none rounded-none',
                }}
                placeholder={''}
              >
                <Link to="">
                  <Tab
                    value=""
                    className={'p-2 cursor-pointer'}
                    placeholder={''}
                  >
                    Overview
                  </Tab>
                </Link>
                <Link to="deployments">
                  <Tab
                    value="deployments"
                    className={'p-2 cursor-pointer'}
                    placeholder={''}
                  >
                    Deployments
                  </Tab>
                </Link>
                <Link to="database">
                  <Tab
                    value="database"
                    className={'p-2 cursor-pointer'}
                    placeholder={''}
                  >
                    Database
                  </Tab>
                </Link>
                <Link to="integrations">
                  <Tab
                    value="integrations"
                    className={'p-2 cursor-pointer'}
                    placeholder={''}
                  >
                    Integrations
                  </Tab>
                </Link>
                <Link to="settings">
                  <Tab
                    value="settings"
                    className={'p-2 cursor-pointer'}
                    placeholder={''}
                  >
                    Settings
                  </Tab>
                </Link>
              </TabsHeader>
              <TabsBody placeholder={''}>
                <Outlet context={{ project, onUpdate }} />
              </TabsBody>
            </Tabs>
          </div>
        </>
      ) : (
        <h4>Project not found</h4>
      )}
    </div>
  );
};

export default Id;
