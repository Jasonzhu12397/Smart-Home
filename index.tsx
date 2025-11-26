import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AdminDashboard from './components/AdminDashboard';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Simple path-based routing check
const path = window.location.pathname;
const isAdmin = path.startsWith('/admin');

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    {isAdmin ? <AdminDashboard /> : <App />}
  </React.StrictMode>
);