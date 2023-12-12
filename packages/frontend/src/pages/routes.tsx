import React from 'react';

import Projects from './Projects';
import Settings from './Settings';
import { projectsRoutes } from './projects/routes';

export const homeRoutes = [
  {
    path: '/',
    element: <Projects />,
  },
  {
    path: 'settings',
    element: <Settings />,
  },
  {
    path: 'projects',
    children: projectsRoutes,
  },
];
