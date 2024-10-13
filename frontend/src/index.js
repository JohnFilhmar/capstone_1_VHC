import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const app = ReactDOM.createRoot(document.getElementById('app'));
app.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

serviceWorkerRegistration.register();