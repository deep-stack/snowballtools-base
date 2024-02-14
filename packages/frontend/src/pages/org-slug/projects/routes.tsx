import React from 'react';

import CreateProject from './Create';
import Id from './Id';
import AddDomain from './id/settings/domains/add';
import { createProjectRoutes } from './create/routes';
import { projectTabRoutes } from './id/routes';
import { addDomainRoutes } from './id/settings/domains/add/routes';

export const projectsRoutesWithoutSearch = [
  {
    path: 'create',
    element: <CreateProject />,
    children: createProjectRoutes,
  },
  {
    path: ':id/settings/domains/add',
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
