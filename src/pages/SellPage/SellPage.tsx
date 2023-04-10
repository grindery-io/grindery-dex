import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import OffersPage from '../OffersPage/OffersPage';
import OrdersPage from '../OrdersPage/OrdersPage';
import AutomationsPage from '../AutomationsPage/AutomationsPage';
import {
  SellMenu,
  PageContainer,
  Loading,
  PageCard,
  PageCardHeader,
  PageCardBody,
} from '../../components';
import { Box, Typography } from '@mui/material';
import TimerIcon from '@mui/icons-material/Timer';
import {
  useAppSelector,
  selectUserIsAdmin,
  selectUserIsAdminLoading,
} from '../../store';
import { ROUTES } from '../../config';
import { WalletsController } from '../../controllers';

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
    component: <OrdersPage />,
  },
  {
    path: ROUTES.SELL.AUTOMATIONS.RELATIVE_PATH,
    fullPath: ROUTES.SELL.AUTOMATIONS.ROOT.FULL_PATH,
    label: 'Trading Automation',
    component: <AutomationsPage />,
  },
  // Route temporary disabled
  /*{
    path: ROUTES.SELL.WALLETS.RELATIVE_PATH,
    fullPath: ROUTES.SELL.WALLETS.ROOT.FULL_PATH,
    label: 'Wallets',
    component: <LiquidityWalletPage />,
  },*/
];

type Props = {};

const SellPage = (props: Props) => {
  const isLoading = useAppSelector(selectUserIsAdminLoading);
  const isAdmin = useAppSelector(selectUserIsAdmin);
  if (isLoading) {
    return <Loading />;
  }
  return (
    <WalletsController>
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
            <PageCard>
              <PageCardHeader title="Coming soon" titleAlign="center" />
              <PageCardBody>
                <Box height="24px" />
                <Typography fontSize="42px" textAlign="center">
                  <TimerIcon sx={{ fontSize: 'inherit' }} />
                </Typography>
                <Box height="40px" />
              </PageCardBody>
            </PageCard>
          </>
        )}
      </PageContainer>
    </WalletsController>
  );
};

export default SellPage;
