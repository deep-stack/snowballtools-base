import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Project } from 'gql-client';

import OverviewTabPanel from './OverviewTabPanel';
import DeploymentsTabPanel from './DeploymentsTabPanel';
import { ProjectDetails } from '../../../types/project';
import SettingsTabPanel from './SettingsTabPanel';

interface ProjectTabsProps {
  project: Project;
  organizationProject: ProjectDetails;
  onUpdate: () => Promise<void>;
}

const Database = () => (
  <div>
    Content of database tab
    <p className="block">
      It is a long established fact that a reader will be distracted by the
      readable content of a page when looking at its layout.
    </p>
  </div>
);
const Integrations = () => (
  <div>
    Content of integrations tab
    <p className="block">
      There are many variations of passages of Lorem Ipsum available.
    </p>
  </div>
);

const ProjectTabs = ({
  project,
  onUpdate,
  organizationProject,
}: ProjectTabsProps) => {
  return (
    <Tabs
      selectedTabClassName={
        'border-b-2 border-gray-900 text-gray-900 focus:outline-none'
      }
    >
      <TabList className="flex border-b border-gray-300 text-gray-600">
        <Tab className={'p-2 cursor-pointer'}>Overview</Tab>
        <Tab className={'p-2 cursor-pointer'}>Deployments</Tab>
        <Tab className={'p-2 cursor-pointer'}>Database</Tab>
        <Tab className={'p-2 cursor-pointer'}>Integrations</Tab>
        <Tab className={'p-2 cursor-pointer'}>Settings</Tab>
      </TabList>
      <TabPanel>
        <OverviewTabPanel
          project={project}
          organizationProject={organizationProject}
        />
      </TabPanel>
      <TabPanel>
        <DeploymentsTabPanel projectId={project.id} />
      </TabPanel>
      <TabPanel>
        <Database />
      </TabPanel>
      <TabPanel>
        <Integrations />
      </TabPanel>
      <TabPanel>
        <SettingsTabPanel project={project} onUpdate={onUpdate} />
      </TabPanel>
    </Tabs>
  );
};

export default ProjectTabs;
