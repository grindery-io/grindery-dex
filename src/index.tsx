import React from 'react';
import { createRoot } from 'react-dom/client';
//import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { App } from './App';
import { WalletProvider } from './providers/WalletProvider';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element.');
}

const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <WalletProvider>
      <App />
    </WalletProvider>
  </React.StrictMode>
);
