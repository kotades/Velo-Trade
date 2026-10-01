
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { AuthProvider } from './context/AuthContext';
import { TradeProvider } from './context/TradeContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <TradeProvider>
        <App />
      </TradeProvider>
    </AuthProvider>
  </React.StrictMode>
);
