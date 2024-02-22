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
import Index from './pages';
import Login from './pages/Login';

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
  {
    path: '/login',
    element: <Login />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
