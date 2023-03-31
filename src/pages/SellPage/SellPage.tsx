import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Loading from '../../components/Loading/Loading';
import PageContainer from '../../components/PageContainer/PageContainer';
import SellMenu from '../../components/SellMenu/SellMenu';
//import LiquidityWalletPageContextProvider from '../../context/LiquidityWalletPageContext';
import OffersPageContextProvider from '../../context/OffersPageContext';
//import StakingPageContextProvider from '../../context/StakingPageContext';
import OrdersPageContextProvider from '../../context/OrdersPageContext';
import OrdersContextProvider from '../../context/OrdersContext';
import useAdmin from '../../hooks/useAdmin';
//import LiquidityWalletPage from '../LiquidityWalletPage/LiquidityWalletPage';
import OffersPage from '../OffersPage/OffersPage';
//import StakingPage from '../StakingPage/StakingPage';
import OrdersBPage from '../OrdersPage/OrdersPage';
import AutomationsPage from '../AutomationsPage/AutomationsPage';
import AutomationsPageContextProvider from '../../context/AutomationsPageContext';
import DexCard from '../../components/DexCard/DexCard';
import DexCardHeader from '../../components/DexCard/DexCardHeader';
import DexCardBody from '../../components/DexCard/DexCardBody';
import { Box, Typography } from '@mui/material';
import TimerIcon from '@mui/icons-material/Timer';

export const sellPages = [
  // {
  //   path: '/staking',
  //   fullPath: '/sell/staking',
  //   label: 'Staking',
  //   component: (
  //     <StakingPageContextProvider>
  //       <StakingPage />
  //     </StakingPageContextProvider>
  //   ),
  // },
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
    path: '/orders',
    fullPath: '/sell/orders',
    label: 'Orders',
    component: (
      <OrdersContextProvider userType="b">
        <OrdersPageContextProvider>
          <OrdersBPage />
        </OrdersPageContextProvider>
      </OrdersContextProvider>
    ),
  },
  {
    path: '/automations',
    fullPath: '/sell/automations',
    label: 'Trading Automation',
    component: (
      <AutomationsPageContextProvider>
        <AutomationsPage />
      </AutomationsPageContextProvider>
    ),
  },
  // {
  //   path: '/wallets',
  //   fullPath: '/sell/wallets',
  //   label: 'Wallets',
  //   component: (
  //     <LiquidityWalletPageContextProvider>
  //       <LiquidityWalletPage />
  //     </LiquidityWalletPageContextProvider>
  //   ),
  // },
];

type Props = {};

const SellPage = (props: Props) => {
  const { isLoading, isAdmin } = useAdmin();
  if (isLoading) {
    return <Loading />;
  }
  return (
    <div>
      <PageContainer>
        {isAdmin ? (
          <>
            <SellMenu />
            <Routes>
              {sellPages.map((page: any) => (
                <Route
                  key={page.path}
                  path={`${page.path}/*`}
                  element={page.component}
                />
              ))}
              <Route
                path="/"
                element={<Navigate to={`/sell${sellPages[0].path}`} />}
              />
            </Routes>
          </>
        ) : (
          <>
            <DexCard>
              <DexCardHeader title="Coming soon" titleAlign="center" />
              <DexCardBody>
                <Box height="24px" />
                <Typography fontSize="42px" textAlign="center">
                  <TimerIcon sx={{ fontSize: 'inherit' }} />
                </Typography>
                <Box height="40px" />
              </DexCardBody>
            </DexCard>
          </>
        )}
      </PageContainer>
    </div>
  );
};

export default SellPage;
