import React from 'react';

import NewProject from './index';
import CreateWithTemplate from './Template';
import { templateRoutes } from './template/routes';

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
];
