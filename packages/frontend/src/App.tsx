import { useEffect } from 'react';
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
import Web3Provider from 'context/Web3Provider';
import { BASE_URL } from 'utils/constants';

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
]);

function App() {
  // Hacky way of checking session
  // TODO: Handle redirect backs
  useEffect(() => {
    fetch(`${BASE_URL}/auth/session`, {
      credentials: 'include',
    }).then((res) => {
      const path = window.location.pathname;
      if (res.status !== 200) {
        localStorage.clear();

        if (path !== '/login') {
          window.location.pathname = '/login';
        }
      } else {
        if (path === '/login') {
          window.location.pathname = '/';
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
