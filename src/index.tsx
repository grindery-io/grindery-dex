import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element.');
}

const root = createRoot(rootElement);

let router = createBrowserRouter([{ path: '*', element: <App /> }]);

export { router };

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
