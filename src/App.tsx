import React from 'react';
import './index.css';
import { Provider } from 'react-redux';
import GrinderyNexusContextProvider from 'use-grindery-nexus';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
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
import AbiController from './controllers/AbiController';
import MainNavigation from './pages/MainNavigation/MainNavigation';

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
          <AbiController>
            <ChainsController>
              <BrowserRouter>
                <AdminContextProvider>
                  <MainNavigation />

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
                            <Route path="/faucet/*" element={<FaucetPage />} />

                            <Route path="*" element={<Navigate to="/buy" />} />
                          </Routes>
                        </LiquidityWalletsContextProvider>
                      </StakesContextProvider>
                    </AbiContextProvider>
                  </GrinderyChainsContextProvider>
                </AdminContextProvider>
              </BrowserRouter>
            </ChainsController>
          </AbiController>
        </UserController>
      </Provider>
    </GrinderyNexusContextProvider>
  );
};
