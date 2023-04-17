import React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { default as AuthenticationProvider } from 'use-grindery-nexus';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import './index.css';
import { store } from './store';
import { BuyPage, SellPage, FaucetPage, MainNavigation } from './pages';
import { UserController, ChainsController, AbiController } from './controllers';
import { theme } from './theme';
import HistoryPage from './pages/HistoryPage/HistoryPage';
import { ROUTES } from './config';
import Page404 from './pages/Page404/Page404';
import { PageContainer } from './components';

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
                    <Route
                      path={ROUTES.BUY.RELATIVE_PATH}
                      element={<BuyPage />}
                    />
                    <Route
                      path={ROUTES.SELL.RELATIVE_PATH}
                      element={<SellPage />}
                    />
                    <Route
                      path={ROUTES.HISTORY.RELATIVE_PATH}
                      element={<HistoryPage />}
                    />
                    <Route
                      path={ROUTES.FAUCET.RELATIVE_PATH}
                      element={<FaucetPage />}
                    />
                    <Route
                      path="/"
                      element={<Navigate to={ROUTES.BUY.FULL_PATH} />}
                    />
                    <Route
                      path="*"
                      element={
                        <PageContainer>
                          <Page404 />
                        </PageContainer>
                      }
                    />
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
