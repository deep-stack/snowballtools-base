import React from 'react';

import NewProject from './index';
import CreateWithTemplate from './Template';
import { templateRoutes } from './template/routes';
import Id from './success/Id';
import Import from './Import';

export const createProjectRoutes = [
  {
    index: true,
    element: <NewProject />,
  },
  {
    path: 'template',
    element: <CreateWithTemplate />,
    children: templateRoutes,
  },
  {
    path: 'success/:id',
    element: <Id />,
  },
  {
    path: 'import',
    element: <Import />,
  },
];
