import React from 'react';
import OffersContextProvider from '../../context/OffersContext';
import StakesContextProvider from '../../context/StakesContext';
import LiquidityWalletPage from '../../pages/LiquidityWalletPage/LiquidityWalletPage';
import OffersPage from '../../pages/OffersPage/OffersPage';
import StakingPage from '../../pages/StakingPage/StakingPage';

export const sellPages = [
  {
    path: '/staking',
    fullPath: '/sell/staking',
    label: 'Staking',
    component: <StakingPage />,
    ContextProvider: StakesContextProvider,
  },
  {
    path: '/offers',
    fullPath: '/sell/offers',
    label: 'Offers',
    component: <OffersPage />,
    ContextProvider: OffersContextProvider,
  },
  {
    path: '/wallets',
    fullPath: '/sell/wallets',
    label: 'Wallets',
    component: <LiquidityWalletPage />,
    ContextProvider: React.Fragment,
  },
];

export const faucetMenu = [
  {
    path: '/',
    fullPath: '/faucet',
    label: 'GRT Tokens',
    external: false,
  },
  {
    path: 'https://goerlifaucet.com/',
    fullPath: 'https://goerlifaucet.com/',
    label: 'Goerli ETH Tokens',
    external: true,
  },
  {
    path: 'https://testnet.bnbchain.org/faucet-smart',
    fullPath: 'https://testnet.bnbchain.org/faucet-smart',
    label: 'Binance BNB Tokens',
    external: true,
  },
  {
    path: 'https://cronos.org/faucet',
    fullPath: 'https://cronos.org/faucet',
    label: 'Cronos CRO Tokens',
    external: true,
  },
];
