import React from 'react';

import CreateProject from './Create';
import Project from './Project';
import { createProjectRoutes } from './create/routes';
import AddDomain from './id/domain/Add';

export const projectsRoutesWithoutSearch = [
  {
    path: 'create',
    element: <CreateProject />,
    children: createProjectRoutes,
  },
  {
    path: ':id/domain/add',
    element: <AddDomain />,
  },
];

export const projectsRoutesWithSearch = [
  {
    path: ':id',
    element: <Project />,
  },
];
