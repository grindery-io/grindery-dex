import React, { useEffect } from 'react';
import { Box } from '@mui/system';
import DexCard from '../../components/DexCard/DexCard';
import DexCardHeader from '../../components/DexCard/DexCardHeader';
import DexCardBody from '../../components/DexCard/DexCardBody';
import NotFound from '../../components/NotFound/NotFound';
import { useNavigate } from 'react-router-dom';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import useOrders from '../../hooks/useOrders';
import OrderCard from '../../components/OrderCard/OrderCard';
import OrderSkeleton from '../../components/OrderCard/OrderSkeleton';
import Order from '../../models/Order';
import { ROUTES } from '../../config/routes';

type Props = {};

const TradePageHistory = (props: Props) => {
  let navigate = useNavigate();
  const { orders, getOrders, isLoading } = useOrders();
  const sortedOrders = orders?.sort((a: any, b: any) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  useEffect(() => {
    getOrders();
  }, []);

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
        {isLoading ? (
          <>
            <OrderSkeleton />
            <OrderSkeleton />
          </>
        ) : (
          <>
            {sortedOrders && sortedOrders.length > 0 ? (
              <>
                {sortedOrders.map((order: Order) => (
                  <OrderCard key={order._id} order={order} userType="a" />
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
