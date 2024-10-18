import CreateRepo from './index';
import Configure from './Configure';
import Deploy from './Deploy';

export const templateRoutes = [
  {
    index: true,
    element: <CreateRepo />,
  },
  {
    path: 'configure',
    element: <Configure />,
  },
  {
    path: 'deploy',
    element: <Deploy />,
  },
];
