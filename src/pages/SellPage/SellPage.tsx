import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import OffersPage from '../OffersPage/OffersPage';
import OrdersPage from '../OrdersPage/OrdersPage';
import AutomationsPage from '../AutomationsPage/AutomationsPage';
import {
  SellMenu,
  Loading,
  PageCard,
  PageCardHeader,
  PageCardBody,
} from '../../components';
import { Box, Typography } from '@mui/material';
import TimerIcon from '@mui/icons-material/Timer';
import { useAppSelector, selectUserStore } from '../../store';
import { ROUTES } from '../../config';
import { WalletsProvider } from '../../providers';
import Page404 from '../Page404/Page404';

type Props = {};

const SellPage = (props: Props) => {
  const { isAdmin, isAdminLoading } = useAppSelector(selectUserStore);

  if (isAdminLoading) {
    return <Loading />;
  }
  return (
    <WalletsProvider>
      {isAdmin ? (
        <>
          <SellMenu />
          <Routes>
            <Route
              path={ROUTES.SELL.OFFERS.RELATIVE_PATH}
              element={<OffersPage />}
            />
            <Route
              path={ROUTES.SELL.ORDERS.RELATIVE_PATH}
              element={<OrdersPage />}
            />
            <Route
              path={ROUTES.SELL.AUTOMATIONS.RELATIVE_PATH}
              element={<AutomationsPage />}
            />
            <Route
              path="/"
              element={<Navigate to={ROUTES.SELL.OFFERS.ROOT.FULL_PATH} />}
            />
            <Route path="*" element={<Page404 />} />
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
    </WalletsProvider>
  );
};

export default SellPage;
