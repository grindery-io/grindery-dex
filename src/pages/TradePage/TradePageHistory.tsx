import React from 'react';
import { Box } from '@mui/system';
import DexCard from '../../components/DexCard/DexCard';
import DexCardHeader from '../../components/DexCard/DexCardHeader';
import DexCardBody from '../../components/DexCard/DexCardBody';
import NotFound from '../../components/NotFound/NotFound';
import { useNavigate } from 'react-router-dom';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import OrderCard from '../../components/OrderCard/OrderCard';
import OrderSkeleton from '../../components/OrderCard/OrderSkeleton';
import { ROUTES } from '../../config/routes';
import { OrderType } from '../../types/OrderType';
import { useAppSelector } from '../../store/storeHooks';
import {
  selectOrdersHistoryItems,
  selectOrdersHistoryLoading,
} from '../../store/slices/ordersHistorySlice';
import { sortOrdersByDate } from '../../utils/helpers/orderHelpers';
import { selectChainsItems } from '../../store/slices/chainsSlice';

type Props = {};

const TradePageHistory = (props: Props) => {
  let navigate = useNavigate();
  const orders = useAppSelector(selectOrdersHistoryItems);
  const isLoading = useAppSelector(selectOrdersHistoryLoading);
  const sortedOrders = sortOrdersByDate(orders);
  const chains = useAppSelector(selectChainsItems);

  return (
    <DexCard>
      <DexCardHeader
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
            <ArrowBackIcon />
          </IconButton>
        }
        endAdornment={<Box width={28} height={40} />}
      />
      <DexCardBody maxHeight="540px">
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
      </DexCardBody>
    </DexCard>
  );
};

export default TradePageHistory;
