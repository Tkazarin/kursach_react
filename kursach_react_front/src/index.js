import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/main_style.css';
import AppRouter from './router/AppRouter';

const root = ReactDOM.createRoot(document.getElementById('root'));
document.title = "plateaus"
root.render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);

