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

const Id = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const client = useGQLClient();
  const location = useLocation();

  const [project, setProject] = useState<ProjectType | null>(null);

  const fetchProject = useCallback(async (id: string | undefined) => {
    if (id) {
      const { project } = await client.getProject(id);
      setProject(project);
    }
  }, []);

  const currentTab = useMemo(() => {
    if (id) {
      const [, tabPath] = location.pathname.split(id);
      return tabPath;
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
            <Tabs value={currentTab}>
              <TabsHeader
                className="rounded-none border-b border-blue-gray-50 bg-transparent p-0"
                indicatorProps={{
                  className:
                    'bg-transparent border-b-2 border-gray-900 shadow-none rounded-none',
                }}
              >
                <Link to="">
                  <Tab value="" className={'p-2 cursor-pointer'}>
                    Overview
                  </Tab>
                </Link>
                <Link to="deployments">
                  <Tab value="/deployments" className={'p-2 cursor-pointer'}>
                    Deployments
                  </Tab>
                </Link>
                <Link to="database">
                  <Tab value="/database" className={'p-2 cursor-pointer'}>
                    Database
                  </Tab>
                </Link>
                <Link to="integrations">
                  <Tab value="/integrations" className={'p-2 cursor-pointer'}>
                    Integrations
                  </Tab>
                </Link>
                <Link to="settings">
                  <Tab value="/settings" className={'p-2 cursor-pointer'}>
                    Settings
                  </Tab>
                </Link>
              </TabsHeader>
              <TabsBody>
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
