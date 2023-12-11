import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Dashboard from './pages/dashboard';
import { DashboardRoutes } from './pages/dashboard/routes';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />,
    children: DashboardRoutes,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
