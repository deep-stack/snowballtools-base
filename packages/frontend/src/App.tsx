import React from 'react'
import {
  createBrowserRouter,
  RouterProvider } from "react-router-dom";

import Dashboard from './pages/dashboard';
import Projects from './pages/dashboard/Projects';
import Settings from './pages/dashboard/Settings';
import Project from './pages/dashboard/Project';
import CreateProject from './pages/dashboard/CreateProject';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
    children: [
      { index: true, element: <Projects /> },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: ":id",
        element: <Project />,
      }, {
        path: "create",
        element: <CreateProject />,
      }
    ]
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
