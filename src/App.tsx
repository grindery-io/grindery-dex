import React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { default as AuthenticationProvider } from 'use-grindery-nexus';
import { ThemeProvider } from '@mui/material/styles';
import './index.css';
import { store } from './store';
import {
  UserProvider,
  ChainsProvider,
  AbiProvider,
  SnackbarsProvider,
} from './providers';
import { theme } from './theme';
import WebsocketProvider from './providers/WebsocketProvider';
import RootPage from './pages/RootPage/RootPage';
import NotificationsProvider from './providers/NotificationsProvider';

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
          <NotificationsProvider>
            <UserProvider>
              <WebsocketProvider>
                <SnackbarsProvider>
                  <AbiProvider>
                    <ChainsProvider>
                      <RootPage />
                    </ChainsProvider>
                  </AbiProvider>
                </SnackbarsProvider>
              </WebsocketProvider>
            </UserProvider>
          </NotificationsProvider>
        </StoreProvider>
      </AuthenticationProvider>
    </ThemeProvider>
  );
};
