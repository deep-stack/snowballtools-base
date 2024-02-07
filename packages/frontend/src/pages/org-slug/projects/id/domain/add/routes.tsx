import React from 'react';

import Config from './Config';
import SetupDomain from '../../../../../../components/projects/project/settings/SetupDomain';

export const addDomainRoutes = [
  {
    index: true,
    element: <SetupDomain />,
  },
  {
    path: 'config',
    element: <Config />,
  },
];
