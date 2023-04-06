import React from 'react';
import './index.css';
import { Provider } from 'react-redux';
import GrinderyNexusContextProvider from 'use-grindery-nexus';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import SellPage from './pages/SellPage/SellPage';
import FaucetPage from './pages/FaucetPage/FaucetPage';
import OffersContextProvider from './context/OffersContext';
import { OrdersContextProvider } from './context/OrdersContext';
import LiquidityWalletsContextProvider from './context/LiquidityWalletsContext';
import BuyPage from './pages/BuyPage/BuyPage';
import { store } from './store/store';
import UserController from './controllers/UserController';
import ChainsController from './controllers/ChainsController';
import AbiController from './controllers/AbiController';
import MainNavigation from './pages/MainNavigation/MainNavigation';
import StakesController from './controllers/StakesController';
import AutomationsController from './controllers/AutomationsController';

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
                <MainNavigation />
                <StakesController>
                  <LiquidityWalletsContextProvider>
                    <AutomationsController>
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
                    </AutomationsController>
                  </LiquidityWalletsContextProvider>
                </StakesController>
              </BrowserRouter>
            </ChainsController>
          </AbiController>
        </UserController>
      </Provider>
    </GrinderyNexusContextProvider>
  );
};
