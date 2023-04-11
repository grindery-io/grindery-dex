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
              <Route path="/" element={<Navigate to="/sell/offers" />} />
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
