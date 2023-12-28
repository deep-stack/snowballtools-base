import React from 'react';

import CreateProject from './Create';
import Project from './Project';
import AddDomain from './id/domain/add';
import { createProjectRoutes } from './create/routes';
import { addDomainRoutes } from './id/domain/add/routes';

export const projectsRoutesWithoutSearch = [
  {
    path: 'create',
    element: <CreateProject />,
    children: createProjectRoutes,
  },
  {
    path: ':id/domain/add',
    element: <AddDomain />,
    children: addDomainRoutes,
  },
];

export const projectsRoutesWithSearch = [
  {
    path: ':id',
    element: <Project />,
  },
];
