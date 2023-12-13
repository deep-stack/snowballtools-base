import React from 'react';

import CreateProject from './Create';
import Project from './Project';

export const projectsRoutes = [
  {
    path: ':id',
    element: <Project />,
  },
  {
    path: 'create',
    element: <CreateProject />,
  },
];
