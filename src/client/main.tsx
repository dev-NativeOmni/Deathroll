import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { AdminProvider } from './context/AdminContext';
import { SiteProvider } from './context/SiteContext';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AdminProvider>
      <SiteProvider>
        <App />
      </SiteProvider>
    </AdminProvider>
  </React.StrictMode>
);
