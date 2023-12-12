import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Dashboard from './pages';
import { dashboardRoutes } from './pages/routes';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />,
    children: dashboardRoutes,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
