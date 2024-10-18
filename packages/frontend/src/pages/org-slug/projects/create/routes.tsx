import NewProject from './index';
import CreateWithTemplate from './Template';
import { templateRoutes } from './template/routes';
import Id from './success/Id';
import Configure from 'components/projects/create/Configure';
import Deploy from 'components/projects/create/Deploy';

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
    path: 'configure',
    element: <Configure />,
  },
  {
    path: 'deploy',
    element: <Deploy />,
  },
];
