import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import DashboardLayout from './layouts/Dashboard';
import Home from './pages/index';
import Settings from './pages/Settings';
import {
  projectsRoutesWithSearch,
  projectsRoutesWithoutSearch,
} from './pages/projects/routes';
import ProjectSearchLayout from './layouts/ProjectSearch';
import { OctokitProvider } from './context/OctokitContext';

const router = createBrowserRouter([
  {
    element: <DashboardLayout />,
    children: [
      {
        element: <ProjectSearchLayout />,
        children: [
          {
            path: '/',
            element: <Home />,
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
]);

function App() {
  return (
    <OctokitProvider>
      <RouterProvider router={router} />
    </OctokitProvider>
  );
}

export default App;
