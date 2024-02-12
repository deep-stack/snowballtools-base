import React from 'react';

import OverviewTabPanel from './Overview';
import DeploymentsTabPanel from './Deployments';
import SettingsTabPanel from './Settings';
import GeneralTabPanel from './settings/General';
import GitTabPanel from './settings/Git';
import { EnvironmentVariablesTabPanel } from './settings/EnvironmentVariables';
import MembersTabPanel from './settings/Members';
import Domains from './settings/Domains';

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

export const settingsTabRoutes = [
  {
    index: true,
    element: <GeneralTabPanel />,
  },
  {
    path: 'domains',
    element: <Domains />,
  },
  {
    path: 'git',
    element: <GitTabPanel />,
  },
  {
    path: 'environment-variables',
    element: <EnvironmentVariablesTabPanel />,
  },
  {
    path: 'members',
    element: <MembersTabPanel />,
  },
];

export const projectTabRoutes = [
  {
    index: true,
    element: <OverviewTabPanel />,
  },
  {
    path: 'deployments',
    element: <DeploymentsTabPanel />,
  },
  {
    path: 'database',
    element: <Database />,
  },
  {
    path: 'integrations',
    element: <Integrations />,
  },
  {
    path: 'settings',
    element: <SettingsTabPanel />,
    children: settingsTabRoutes,
  },
];
