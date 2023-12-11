import React from 'react';

import Projects from './Projects';
import Project from './Project';
import Settings from './Settings';
import CreateProject from './CreateProject';

export const dashboardRoutes = [
  {
    path: '/',
    element: <Projects />,
  },
  {
    path: 'settings',
    element: <Settings />,
  },
  {
    path: ':id',
    element: <Project />,
  },
  {
    path: 'create',
    element: <CreateProject />,
  },
];
