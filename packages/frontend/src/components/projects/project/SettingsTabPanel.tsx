import React, { createElement } from 'react';
import { Project } from 'gql-client';

import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from '@material-tailwind/react';

import Domains from './settings/Domains';
import GeneralTabPanel from './settings/GeneralTabPanel';
import { EnvironmentVariablesTabPanel } from './settings/EnvironmentVariablesTabPanel';
import GitTabPanel from './settings/GitTabPanel';
import MembersTabPanel from './settings/MembersTabPanel';

const tabsData = [
  {
    label: 'General',
    icon: '^',
    value: 'general',
    component: GeneralTabPanel,
  },
  {
    label: 'Domains',
    icon: '^',
    value: 'domains',
    component: Domains,
  },
  {
    label: 'Git',
    icon: '^',
    value: 'git',
    component: GitTabPanel,
  },
  {
    label: 'Environment variables',
    icon: '^',
    value: 'environmentVariables',
    component: EnvironmentVariablesTabPanel,
  },
  {
    label: 'Members',
    icon: '^',
    value: 'members',
    component: MembersTabPanel,
  },
];

const SettingsTabPanel = ({
  project,
  onUpdate,
}: {
  project: Project;
  onUpdate: () => Promise<void>;
}) => {
  return (
    <>
      <Tabs
        value={'general'}
        orientation="vertical"
        className="grid grid-cols-4"
      >
        <TabsHeader
          className="bg-transparent col-span-1"
          indicatorProps={{
            className: 'bg-gray-900/10 shadow-none !text-gray-900',
          }}
        >
          {tabsData.map(({ label, value, icon }) => (
            <Tab key={value} value={value} className="flex justify-start">
              <div className="flex gap-2">
                <div>{icon}</div>
                <div>{label}</div>
              </div>
            </Tab>
          ))}
        </TabsHeader>
        <TabsBody className="col-span-2">
          {tabsData.map(({ value, component }) => (
            <TabPanel key={value} value={value} className="p-2">
              {createElement(component, {
                project: project,
                onUpdate: onUpdate,
              })}
            </TabPanel>
          ))}
        </TabsBody>
      </Tabs>
    </>
  );
};

export default SettingsTabPanel;
