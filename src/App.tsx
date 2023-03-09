import type { Token } from '@lifi/sdk';
import {
  addChain,
  switchChain,
  switchChainAndAddToken,
} from '@lifi/wallet-management';
import type { WidgetVariant } from '@lifi/widget';
import {
  Box,
  // Button,
  Checkbox,
  CssBaseline,
  Drawer,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Switch,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { WalletButtons } from './components/WalletButtons';
import { WidgetEvents } from './components/WidgetEvents';
import { widgetBaseConfig, widgetConfig, WidgetVariants } from './config';
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

declare global {
  interface Window {
    ethereum: any;
  }
}

export const App = () => {
  const { connect, disconnect, account } = useWallet();
  const [searchParams] = useState(() =>
    Object.fromEntries(new URLSearchParams(window?.location.search))
  );
  const [externalWallerManagement, setExternalWalletManagement] =
    useState<boolean>(true);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [config, setConfig] = useState(widgetConfig);
  const [variant, setVariant] = useState<WidgetVariant>(
    searchParams.drawer ? 'drawer' : 'expandable'
  );
  const [fontFamily, setFontFamily] = useState('Inter var, Inter, sans-serif');
  const [borderRadius, setBorderRadius] = useState(12);
  const [borderRadiusSecondary, setBorderRadiusSecondary] = useState(8);
  const [primary, setPrimaryColor] = useState('#3F49E1');
  const [secondary, setSecondaryColor] = useState('#F5B5FF');

  const [darkMode, setDarkMode] = useState(prefersDarkMode);
  const [systemColor, setSystemColor] = useState(true);
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
      ...(variant === 'drawer'
        ? widgetBaseConfig
        : {
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
          }),
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
            <Route
              path="/faucet"
              element={
                <GrinderyThemeProvider>
                  <Box
                    display="flex"
                    height="calc(100vh - 75px)"
                    style={{ paddingTop: '75px' }}
                  >
                    <Box flex={1} style={{ margin: '50px auto auto' }}>
                      <FaucetPage />
                    </Box>
                  </Box>
                </GrinderyThemeProvider>
              }
            />
            <Route
              path="/staking"
              element={
                <GrinderyThemeProvider>
                  <Box
                    display="flex"
                    height="calc(100vh - 75px)"
                    style={{ paddingTop: '75px' }}
                  >
                    <Box flex={1} style={{ margin: '50px auto auto' }}>
                      <StakingPage />
                    </Box>
                  </Box>
                </GrinderyThemeProvider>
              }
            />
            <Route path="*" element={<Navigate to="/faucet" />} />
          </Routes>
        </BrowserRouter>
      </AppContextProvider>
    </GrinderyNexusContextProvider>
  );
};
