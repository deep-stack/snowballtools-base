import OverviewTabPanel from './Overview';
import DeploymentsTabPanel from './Deployments';
import SettingsTabPanel from './Settings';
import GeneralTabPanel from './settings/General';
import GitTabPanel from './settings/Git';
import { EnvironmentVariablesTabPanel } from './settings/EnvironmentVariables';
import CollaboratorsTabPanel from './settings/Collaborators';
import Domains from './settings/Domains';

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
    path: 'collaborators',
    element: <CollaboratorsTabPanel />,
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
    path: 'integrations',
    element: <Integrations />,
  },
  {
    path: 'settings',
    element: <SettingsTabPanel />,
    children: settingsTabRoutes,
  },
];
