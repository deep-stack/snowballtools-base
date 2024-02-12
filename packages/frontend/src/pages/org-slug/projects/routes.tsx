import React from 'react';

import CreateProject from './Create';
import Id from './Id';
import AddDomain from './id/domain/add';
import { createProjectRoutes } from './create/routes';
import { addDomainRoutes } from './id/domain/add/routes';
import { projectTabRoutes } from './id/routes';

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
    element: <Id />,
    children: projectTabRoutes,
  },
];
