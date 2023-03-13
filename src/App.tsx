import React, { useEffect, useState } from 'react';
import type { Token } from '@lifi/sdk';
import {
  addChain,
  switchChain,
  switchChainAndAddToken,
} from '@lifi/wallet-management';
import { Box, useMediaQuery } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { WidgetEvents } from './components/WidgetEvents';
import { widgetConfig } from './config';
import './index.css';
import { LiFiWidget } from './LiFiWidget';
import { useWallet } from './providers/WalletProvider';
import { ThemeProvider as GrinderyThemeProvider } from 'grindery-ui';
import GrinderyNexusContextProvider from 'use-grindery-nexus';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppContextProvider from './context/AppContext';
import EarlyAccessModal from './components/grindery/EarlyAccessModal';
import AppHeader from './components/grindery/AppHeader';
import FaucetPage from './pages/FaucetPage/FaucetPage';
import StakingPage from './pages/StakingPage/StakingPage';
import OffersPage from './pages/OffersPage/OffersPage';
import DexPageContainer from './components/grindery/DexPageContainer/DexPageContainer';
import { dexPages } from './components/pages/dexPages';

declare global {
  interface Window {
    ethereum: any;
  }
}

export const App = () => {
  const { connect, disconnect, account } = useWallet();
  const externalWallerManagement = true;
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [config, setConfig] = useState(widgetConfig);

  const variant = 'expandable';

  const fontFamily = 'Inter var, Inter, sans-serif';
  const borderRadius = 12;
  const borderRadiusSecondary = 8;
  const primary = '#3F49E1';
  const secondary = '#F5B5FF';

  const [darkMode, setDarkMode] = useState(prefersDarkMode);
  const systemColor = true;
  const [theme, setTheme] = useState(() =>
    createTheme({
      palette: {
        mode: 'light',
        primary: {
          main: '#3F49E1',
        },
        secondary: {
          main: '#F5B5FF',
        },
        background: {
          default: '#F4F5F6',
        },
      },
    })
  );

  useEffect(() => {
    setConfig(() => ({
      ...{
        ...widgetConfig,
        appearance: 'light',
        containerStyle: {
          ...widgetConfig.containerStyle,
          // border: `1px solid ${
          //   (systemColor && prefersDarkMode) || darkMode
          //     ? 'rgb(66, 66, 66)'
          //     : 'rgb(234, 234, 234)'
          // }`,
        },
      },
      theme: {
        palette: {
          primary: {
            main: primary,
          },
          secondary: {
            main: secondary,
          },
          ...widgetConfig.theme?.palette,
        },
        shape: {
          borderRadius,
          borderRadiusSecondary,
        },
        typography: {
          fontFamily,
        },
        components: widgetConfig.theme?.components,
      },
      variant,
    }));
  }, [
    borderRadius,
    borderRadiusSecondary,
    darkMode,
    fontFamily,
    prefersDarkMode,
    primary,
    secondary,
    systemColor,
    variant,
  ]);

  useEffect(() => {
    if (externalWallerManagement) {
      setConfig((config) => ({
        ...config,
        appearance: 'light',
        walletManagement: {
          signer: account.signer,
          connect: async () => {
            await connect();
            return account.signer!;
          },
          disconnect: async () => {
            disconnect();
          },
          switchChain: async (reqChainId: number) => {
            await switchChain(reqChainId);
            if (account.signer) {
              return account.signer!;
            }
            throw Error('No signer object after chain switch');
          },
          addToken: async (token: Token, chainId: number) => {
            await switchChainAndAddToken(chainId, token);
          },
          addChain: async (chainId: number) => {
            return addChain(chainId);
          },
        },
      }));
    } else {
      setConfig((config) => ({
        ...config,
        walletManagement: undefined,
        appearance: 'light',
      }));
    }
  }, [externalWallerManagement, account.signer, connect, disconnect]);

  useEffect(() => {
    setTheme(
      createTheme({
        palette: {
          mode: 'light',
          primary: {
            main: primary,
          },
          secondary: {
            main: secondary,
          },
          background: {
            default: '#F4F5F6',
          },
        },
      })
    );
    if (systemColor) {
      setDarkMode(systemColor && prefersDarkMode);
    }
  }, [darkMode, prefersDarkMode, primary, secondary, systemColor]);

  return (
    <GrinderyNexusContextProvider>
      <AppContextProvider>
        <BrowserRouter>
          <GrinderyThemeProvider>
            <EarlyAccessModal />
            <AppHeader />
          </GrinderyThemeProvider>
          <Routes>
            <Route
              path="/swap/*"
              element={
                <>
                  <ThemeProvider theme={theme}>
                    <WidgetEvents />
                    <Box
                      display="flex"
                      height="calc(100vh - 75px)"
                      style={{ paddingTop: '75px' }}
                    >
                      <Box flex={1} margin="auto">
                        <LiFiWidget config={config} open />
                      </Box>
                    </Box>
                  </ThemeProvider>
                </>
              }
            />
            {dexPages.map((page: any) => (
              <Route
                key={page.path}
                path={page.path}
                element={<DexPageContainer>{page.component}</DexPageContainer>}
              />
            ))}

            <Route path="*" element={<Navigate to="/faucet" />} />
          </Routes>
        </BrowserRouter>
      </AppContextProvider>
    </GrinderyNexusContextProvider>
  );
};
