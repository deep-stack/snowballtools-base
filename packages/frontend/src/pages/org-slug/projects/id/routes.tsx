import React from 'react';

import OverviewTabPanel from './OverviewTabPanel';
import DeploymentsTabPanel from './DeploymentsTabPanel';
import SettingsTabPanel from './SettingsTabPanel';

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
  },
];
