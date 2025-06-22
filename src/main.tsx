import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.module.css';
import Layout from './components/Layout/Layout';
import CsvAnalytics from './components/CsvAnalytics/CsvAnalytics';
import CsvGenerator from './components/CsvGenerator/CsvGenerator';
import History from './components/CsvHistory/CsvHistory';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <CsvAnalytics />,
      },
      {
        path: '/generator',
        element: <CsvGenerator />,
      },
      {
        path: '/history',
        element: <History />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
