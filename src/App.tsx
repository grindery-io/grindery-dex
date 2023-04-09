import React from 'react';
import './index.css';
import { Provider as StoreProvider } from 'react-redux';
import { default as AuthenticationProvider } from 'use-grindery-nexus';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import SellPage from './pages/SellPage/SellPage';
import FaucetPage from './pages/FaucetPage/FaucetPage';
import LiquidityWalletsContextProvider from './context/LiquidityWalletsContext';
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
    <AuthenticationProvider>
      <StoreProvider store={store}>
        <UserController>
          <AbiController>
            <ChainsController>
              <BrowserRouter>
                <MainNavigation />

                <LiquidityWalletsContextProvider>
                  <Routes>
                    <Route path="/buy/*" element={<BuyPage />} />
                    <Route path="/sell/*" element={<SellPage />} />
                    <Route path="/faucet/*" element={<FaucetPage />} />

                    <Route path="*" element={<Navigate to="/buy" />} />
                  </Routes>
                </LiquidityWalletsContextProvider>
              </BrowserRouter>
            </ChainsController>
          </AbiController>
        </UserController>
      </StoreProvider>
    </AuthenticationProvider>
  );
};
