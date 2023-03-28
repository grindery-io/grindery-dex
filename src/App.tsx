import React from 'react';
import './index.css';
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
import BuyPage from './pages/BuyPage/BuyPage';
import FaucetPageContextProvider from './context/FaucetPageContext';
import BuyPageContextProvider from './context/BuyPageContext';
import OffersContextProvider from './context/OffersContext';
import { OrdersContextProvider } from './context/OrdersContext';
import StakesContextProvider from './context/StakesContext';
import LiquidityWalletsContextProvider from './context/LiquidityWalletsContext';
import AdminContextProvider from './context/AdminContext';

declare global {
  interface Window {
    ethereum: any;
  }
}

export const App = () => {
  return (
    <GrinderyNexusContextProvider>
      <AppContextProvider>
        <BrowserRouter>
          <AdminContextProvider>
            <GrinderyThemeProvider>
              <EarlyAccessModal />
              <AppHeader />
            </GrinderyThemeProvider>
            <GrinderyChainsContextProvider>
              <AbiContextProvider>
                <StakesContextProvider>
                  <OffersContextProvider>
                    <LiquidityWalletsContextProvider>
                      <Routes>
                        <Route
                          path="/buy/*"
                          element={
                            <OffersContextProvider>
                              <OrdersContextProvider>
                                <BuyPageContextProvider>
                                  <BuyPage />
                                </BuyPageContextProvider>
                              </OrdersContextProvider>
                            </OffersContextProvider>
                          }
                        />
                        <Route path="/sell/*" element={<SellPage />} />
                        <Route
                          path="/faucet/*"
                          element={
                            <PageContainer>
                              <FaucetPageContextProvider>
                                <FaucetPage />
                              </FaucetPageContextProvider>
                            </PageContainer>
                          }
                        />

                        <Route path="*" element={<Navigate to="/buy" />} />
                      </Routes>
                    </LiquidityWalletsContextProvider>
                  </OffersContextProvider>
                </StakesContextProvider>
              </AbiContextProvider>
            </GrinderyChainsContextProvider>
          </AdminContextProvider>
        </BrowserRouter>
      </AppContextProvider>
    </GrinderyNexusContextProvider>
  );
};
