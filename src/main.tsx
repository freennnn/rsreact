import React from 'react';

import ReactDOM from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';

import './index.css';
import { ThemeProvider } from './context/ThemeContext';
import { router } from './router.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
