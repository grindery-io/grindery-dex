import React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { default as AuthenticationProvider } from 'use-grindery-nexus';
import { ThemeProvider } from '@mui/material/styles';
import './index.css';
import { store } from './store';
import { UserProvider, ChainsProvider, AbiProvider } from './providers';
import { theme } from './theme';
import AppRouter from './pages/AppRouter/AppRouter';
import WebsocketProvider from './providers/WebsocketProvider';

declare global {
  interface Window {
    ethereum: any;
  }
}

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <AuthenticationProvider>
        <StoreProvider store={store}>
          <UserProvider>
            <WebsocketProvider>
              <AbiProvider>
                <ChainsProvider>
                  <AppRouter />
                </ChainsProvider>
              </AbiProvider>
            </WebsocketProvider>
          </UserProvider>
        </StoreProvider>
      </AuthenticationProvider>
    </ThemeProvider>
  );
};
