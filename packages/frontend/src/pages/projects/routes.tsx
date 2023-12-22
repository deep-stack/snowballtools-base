import React from 'react';

import CreateProject from './Create';
import Project from './Project';
import { createProjectRoutes } from './create/routes';

export const projectsRoutesWithoutSearch = [
  {
    path: 'create',
    element: <CreateProject />,
    children: createProjectRoutes,
  },
];

export const projectsRoutesWithSearch = [
  {
    path: ':id',
    element: <Project />,
  },
];
