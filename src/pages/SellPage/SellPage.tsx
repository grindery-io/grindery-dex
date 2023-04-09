import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Loading from '../../components/Loading/Loading';
import PageContainer from '../../components/PageContainer/PageContainer';
import SellMenu from '../../components/SellMenu/SellMenu';
import OrdersContextProvider from '../../context/OrdersContext';
import OffersPage from '../OffersPage/OffersPage';
import OrdersPage from '../OrdersPage/OrdersPage';
import AutomationsPage from '../AutomationsPage/AutomationsPage';
import DexCard from '../../components/DexCard/DexCard';
import DexCardHeader from '../../components/DexCard/DexCardHeader';
import DexCardBody from '../../components/DexCard/DexCardBody';
import { Box, Typography } from '@mui/material';
import TimerIcon from '@mui/icons-material/Timer';
import { useAppSelector } from '../../store/storeHooks';
import {
  selectUserIsAdmin,
  selectUserIsAdminLoading,
} from '../../store/slices/userSlice';
import { ROUTES } from '../../config/routes';

export const sellPages = [
  // Route temporary disabled
  /*{
    path: ROUTES.SELL.STAKING.RELATIVE_PATH,
    fullPath: ROUTES.SELL.STAKING.ROOT.FULL_PATH,
    label: 'Staking',
    component: <StakingPage />,
  },*/
  {
    path: ROUTES.SELL.OFFERS.RELATIVE_PATH,
    fullPath: ROUTES.SELL.OFFERS.ROOT.FULL_PATH,
    label: 'Offers',
    component: <OffersPage />,
  },
  {
    path: ROUTES.SELL.ORDERS.RELATIVE_PATH,
    fullPath: ROUTES.SELL.ORDERS.ROOT.FULL_PATH,
    label: 'Orders',
    component: (
      <OrdersContextProvider userType="b">
        <OrdersPage />
      </OrdersContextProvider>
    ),
  },
  {
    path: ROUTES.SELL.AUTOMATIONS.RELATIVE_PATH,
    fullPath: ROUTES.SELL.AUTOMATIONS.ROOT.FULL_PATH,
    label: 'Trading Automation',
    component: <AutomationsPage />,
  },
  // Route temporary disabled
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
  const isLoading = useAppSelector(selectUserIsAdminLoading);
  const isAdmin = useAppSelector(selectUserIsAdmin);
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
                  path={`${page.path}`}
                  element={page.component}
                />
              ))}
              <Route
                path="/"
                element={
                  <Navigate
                    to={`/sell${sellPages[0].path.replace('/*', '')}`}
                  />
                }
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
