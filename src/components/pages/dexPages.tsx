import React from 'react';
import OffersPageContextProvider from '../../context/OffersPageContext';
import LiquidityWalletPage from '../../pages/LiquidityWalletPage/LiquidityWalletPage';
import OffersPage from '../../pages/OffersPage/OffersPage';
import StakingPage from '../../pages/StakingPage/StakingPage';

export const sellPages = [
  {
    path: '/staking',
    fullPath: '/sell/staking',
    label: 'Staking',
    component: <StakingPage />,
  },
  {
    path: '/offers',
    fullPath: '/sell/offers',
    label: 'Offers',
    component: (
      <OffersPageContextProvider>
        <OffersPage />
      </OffersPageContextProvider>
    ),
  },
  {
    path: '/wallets',
    fullPath: '/sell/wallets',
    label: 'Wallets',
    component: <LiquidityWalletPage />,
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
