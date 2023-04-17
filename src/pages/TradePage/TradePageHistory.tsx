import React from 'react';
import { Box } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import {
  OrderSkeleton,
  OrderCard,
  NotFound,
  PageCard,
  PageCardHeader,
  PageCardBody,
} from '../../components';
import { ROUTES } from '../../config';
import { OrderType } from '../../types';
import {
  useAppSelector,
  selectOrdersHistoryItems,
  selectOrdersHistoryLoading,
  selectChainsItems,
} from '../../store';
import { sortOrdersByDate } from '../../utils';

type Props = {};

const TradePageHistory = (props: Props) => {
  let navigate = useNavigate();
  const orders = useAppSelector(selectOrdersHistoryItems);
  const isLoading = useAppSelector(selectOrdersHistoryLoading);
  const sortedOrders = sortOrdersByDate(orders);
  const chains = useAppSelector(selectChainsItems);

  return (
    <PageCard>
      <PageCardHeader
        title="Orders history"
        titleSize={18}
        titleAlign="center"
        startAdornment={
          <IconButton
            size="medium"
            edge="start"
            onClick={() => {
              navigate(ROUTES.BUY.TRADE.ROOT.FULL_PATH);
            }}
          >
            <ArrowBackIcon id="return-icon" />
          </IconButton>
        }
        endAdornment={<Box width={28} height={40} />}
      />
      <PageCardBody maxHeight="540px">
        {orders.length < 1 && isLoading ? (
          <>
            <OrderSkeleton />
            <OrderSkeleton />
          </>
        ) : (
          <>
            {sortedOrders && sortedOrders.length > 0 ? (
              <>
                {sortedOrders.map((order: OrderType) => (
                  <OrderCard
                    key={order._id}
                    chains={chains}
                    order={order}
                    userType="a"
                  />
                ))}
                <Box height="10px" />
              </>
            ) : (
              <NotFound text="No orders found" />
            )}
          </>
        )}
      </PageCardBody>
    </PageCard>
  );
};

export default TradePageHistory;
