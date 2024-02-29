import React from 'react';

import Id from './Id';
import AddDomain from './id/settings/domains/add';
import { createProjectRoutes } from './create/routes';
import { projectTabRoutes } from './id/routes';
import { addDomainRoutes } from './id/settings/domains/add/routes';
import { CreateProjectLayout } from './create/layout';

export const projectsRoutesWithoutSearch = [
  {
    path: 'create',
    element: <CreateProjectLayout />,
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
