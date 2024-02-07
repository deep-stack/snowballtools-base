import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import OrgSlug from './pages/OrgSlug';
import Projects from './pages/org-slug';
import Settings from './pages/org-slug/Settings';
import {
  projectsRoutesWithSearch,
  projectsRoutesWithoutSearch,
} from './pages/org-slug/projects/routes';
import ProjectSearchLayout from './layouts/ProjectSearch';
import { OctokitProvider } from './context/OctokitContext';
import Index from './pages';

const router = createBrowserRouter([
  {
    path: ':orgSlug',
    element: <OrgSlug />,
    children: [
      {
        element: <ProjectSearchLayout />,
        children: [
          {
            path: '',
            element: <Projects />,
          },
          {
            path: 'projects',
            children: projectsRoutesWithSearch,
          },
        ],
      },
      {
        path: 'settings',
        element: <Settings />,
      },
      {
        path: 'projects',
        children: projectsRoutesWithoutSearch,
      },
    ],
  },
  {
    path: '/',
    element: <Index />,
  },
]);

function App() {
  return (
    <OctokitProvider>
      <RouterProvider router={router} />
    </OctokitProvider>
  );
}

export default App;
