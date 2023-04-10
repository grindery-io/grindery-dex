import React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { default as AuthenticationProvider } from 'use-grindery-nexus';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import './index.css';
import { store } from './store/store';
import { BuyPage, SellPage, FaucetPage, MainNavigation } from './pages';
import { UserController, ChainsController, AbiController } from './controllers';
import { theme } from './theme';

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
                <BrowserRouter>
                  <MainNavigation />
                  <Routes>
                    <Route path="/buy/*" element={<BuyPage />} />
                    <Route path="/sell/*" element={<SellPage />} />
                    <Route path="/faucet/*" element={<FaucetPage />} />
                    <Route path="*" element={<Navigate to="/buy" />} />
                  </Routes>
                </BrowserRouter>
              </ChainsController>
            </AbiController>
          </UserController>
        </StoreProvider>
      </AuthenticationProvider>
    </ThemeProvider>
  );
};
