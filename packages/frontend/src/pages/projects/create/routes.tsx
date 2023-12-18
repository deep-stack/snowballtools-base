import React from 'react';

import NewProject from './index';
import CreateWithTemplate from './Template';

export const createProjectRoutes = [
  {
    index: true,
    element: <NewProject />,
  },
  {
    path: 'template',
    element: <CreateWithTemplate />,
  },
];
