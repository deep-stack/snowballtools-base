import CreateRepo from './index';
import Deploy from './Deploy';

export const templateRoutes = [
  {
    index: true,
    element: <CreateRepo />,
  },
  {
    path: 'deploy',
    element: <Deploy />,
  },
];
