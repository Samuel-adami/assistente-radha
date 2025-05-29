import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import axios from 'axios';

// ✅ Configura interceptor para enviar automaticamente o header Authorization
axios.interceptors.request.use((config) => {
  const credenciais = localStorage.getItem("credenciais"); // Exemplo: "usuario:senha"
  if (credenciais) {
    config.headers.Authorization = credenciais;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

serviceWorkerRegistration.register();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);