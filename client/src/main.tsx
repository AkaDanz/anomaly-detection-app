import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ZThresholdProvider } from './context/ZThresholdContext.jsx';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ZThresholdProvider>
      <App />
    </ZThresholdProvider>
  </React.StrictMode>
);