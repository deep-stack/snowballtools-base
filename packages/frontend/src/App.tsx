import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Home from './pages/index';
import { homeRoutes } from './pages/routes';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    children: homeRoutes,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
