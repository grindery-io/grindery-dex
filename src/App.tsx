import React from 'react';
import './index.css';
import { ThemeProvider as GrinderyThemeProvider } from 'grindery-ui';
import GrinderyNexusContextProvider from 'use-grindery-nexus';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppContextProvider from './context/AppContext';
import EarlyAccessModal from './components/grindery/EarlyAccessModal';
import AppHeader from './components/grindery/AppHeader';
import DexPageContainer from './components/grindery/DexPageContainer/DexPageContainer';
import AbiContextProvider from './context/AbiContext';
import GrinderyChainsContextProvider from './context/GrinderyChainsContext';
import SellPage from './pages/SellPage/SellPage';
import FaucetPage from './pages/FaucetPage/FaucetPage';
import BuyPage from './pages/BuyPage/BuyPage';
import FaucetPageContextProvider from './context/FaucetPageContext';
import BuyPageContextProvider from './context/BuyPageContext';
import OffersContextProvider from './context/OffersContext';
import TradesContextProvider from './context/TradesContext';
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
                              <TradesContextProvider>
                                <BuyPageContextProvider>
                                  <BuyPage />
                                </BuyPageContextProvider>
                              </TradesContextProvider>
                            </OffersContextProvider>
                          }
                        />
                        <Route path="/sell/*" element={<SellPage />} />
                        <Route
                          path="/faucet/*"
                          element={
                            <DexPageContainer>
                              <FaucetPageContextProvider>
                                <FaucetPage />
                              </FaucetPageContextProvider>
                            </DexPageContainer>
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
