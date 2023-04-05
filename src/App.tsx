import React from 'react';
import './index.css';
import { Provider } from 'react-redux';
import { ThemeProvider as GrinderyThemeProvider } from 'grindery-ui';
import GrinderyNexusContextProvider from 'use-grindery-nexus';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppContextProvider from './context/AppContext';
import EarlyAccessModal from './components/EarlyAccessModal/EarlyAccessModal';
import AppHeader from './components/AppHeader/AppHeader';
import PageContainer from './components/PageContainer/PageContainer';
import AbiContextProvider from './context/AbiContext';
import GrinderyChainsContextProvider from './context/GrinderyChainsContext';
import SellPage from './pages/SellPage/SellPage';
import FaucetPage from './pages/FaucetPage/FaucetPage';
import OffersContextProvider from './context/OffersContext';
import { OrdersContextProvider } from './context/OrdersContext';
import StakesContextProvider from './context/StakesContext';
import LiquidityWalletsContextProvider from './context/LiquidityWalletsContext';
import AdminContextProvider from './context/AdminContext';
import BuyPage from './pages/BuyPage/BuyPage';
import { store } from './store/store';
import UserController from './controllers/UserController';
import ChainsController from './controllers/ChainsController';

declare global {
  interface Window {
    ethereum: any;
  }
}

export const App = () => {
  return (
    <GrinderyNexusContextProvider>
      <Provider store={store}>
        <UserController>
          <ChainsController>
            <AppContextProvider>
              <BrowserRouter>
                <AdminContextProvider>
                  <GrinderyThemeProvider>
                    <EarlyAccessModal />
                  </GrinderyThemeProvider>
                  <AppHeader />

                  <GrinderyChainsContextProvider>
                    <AbiContextProvider>
                      <StakesContextProvider>
                        <LiquidityWalletsContextProvider>
                          <Routes>
                            <Route
                              path="/buy/*"
                              element={
                                <OffersContextProvider userType="a">
                                  <OrdersContextProvider>
                                    <BuyPage />
                                  </OrdersContextProvider>
                                </OffersContextProvider>
                              }
                            />
                            <Route
                              path="/sell/*"
                              element={
                                <OffersContextProvider userType="b">
                                  <SellPage />
                                </OffersContextProvider>
                              }
                            />
                            <Route
                              path="/faucet/*"
                              element={
                                <PageContainer>
                                  <FaucetPage />
                                </PageContainer>
                              }
                            />

                            <Route path="*" element={<Navigate to="/buy" />} />
                          </Routes>
                        </LiquidityWalletsContextProvider>
                      </StakesContextProvider>
                    </AbiContextProvider>
                  </GrinderyChainsContextProvider>
                </AdminContextProvider>
              </BrowserRouter>
            </AppContextProvider>
          </ChainsController>
        </UserController>
      </Provider>
    </GrinderyNexusContextProvider>
  );
};
