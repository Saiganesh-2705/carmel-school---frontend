import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ConfirmProvider } from './components/Confirm';
import ErrorBoundary from './components/ErrorBoundary';
import './styles/index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter><ThemeProvider><AuthProvider><ConfirmProvider><ErrorBoundary><App /></ErrorBoundary></ConfirmProvider><Toaster position="top-right" gutter={10} toastOptions={{ duration: 3500, className: 'pro-toast', style: { borderRadius: '14px', padding: '12px 16px', fontSize: '14px', fontWeight: 500, boxShadow: '0 18px 40px -18px rgba(15,37,72,.45)', border: '1px solid rgba(15,37,72,.06)' }, success: { iconTheme: { primary: '#14a39a', secondary: '#fff' } }, error: { iconTheme: { primary: '#dc2626', secondary: '#fff' } } }} /></AuthProvider></ThemeProvider></BrowserRouter>
  </React.StrictMode>
);
