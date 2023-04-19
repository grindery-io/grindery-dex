import React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { default as AuthenticationProvider } from 'use-grindery-nexus';
import { ThemeProvider } from '@mui/material/styles';
import './index.css';
import { store } from './store';
import { UserController, ChainsController, AbiController } from './controllers';
import { theme } from './theme';
import AppRouter from './pages/AppRouter/AppRouter';
import Popup from './components/Popup/Popup';

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
          <UserController>
            <AbiController>
              <ChainsController>
                <AppRouter />
                <Popup />
              </ChainsController>
            </AbiController>
          </UserController>
        </StoreProvider>
      </AuthenticationProvider>
    </ThemeProvider>
  );
};
