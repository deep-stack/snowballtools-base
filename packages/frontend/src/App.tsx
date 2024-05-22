import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Projects from './pages/org-slug';
import Settings from './pages/org-slug/Settings';
import {
  projectsRoutesWithSearch,
  projectsRoutesWithoutSearch,
} from './pages/org-slug/projects/routes';
import ProjectSearchLayout from './layouts/ProjectSearch';
import Index from './pages';
import AuthPage from './pages/AuthPage';
import { DashboardLayout } from './pages/org-slug/layout';
import { useEffect } from 'react';
import Web3Provider from 'context/Web3Provider';

const router = createBrowserRouter([
  {
    path: ':orgSlug',
    element: <DashboardLayout />,
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
    element: <AuthPage />,
  },
  {
    path: '/signup',
    element: <AuthPage />,
  },
]);

function App() {
  // Hacky way of checking session
  // TODO: Handle redirect backs
  useEffect(() => {
    fetch(`${import.meta.env.VITE_SERVER_URL}/auth/session`, {
      credentials: 'include',
    }).then((res) => {
      if (res.status !== 200) {
        localStorage.clear();
        const path = window.location.pathname;
        if (path !== '/login' && path !== '/signup') {
          window.location.pathname = '/login';
        }
      }
    });
  }, []);

  return (
    <Web3Provider>
      <RouterProvider router={router} />
    </Web3Provider>
  );
}

export default App;
