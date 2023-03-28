import React, { useEffect } from 'react';
import { Box } from '@mui/system';
import DexCard from '../../components/DexCard/DexCard';
import DexCardHeader from '../../components/DexCard/DexCardHeader';
import useBuyPage from '../../hooks/useBuyPage';
import DexCardBody from '../../components/DexCard/DexCardBody';
import NotFound from '../../components/NotFound/NotFound';
import { useNavigate } from 'react-router-dom';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import useOrders from '../../hooks/useOrders';
import { OrderType } from '../../types/Order';
import Order from '../../components/Order/Order';
import OrderSkeleton from '../../components/Order/OrderSkeleton';

type Props = {};

const BuyPageHistory = (props: Props) => {
  const { VIEWS } = useBuyPage();
  const { orders, getOrders, isLoading } = useOrders();

  const sortedOrders = orders?.sort((a: any, b: any) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  let navigate = useNavigate();

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
              navigate(VIEWS.ROOT.fullPath);
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
                {sortedOrders.map((order: OrderType) => (
                  <Order key={order._id} order={order} userType="a" />
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

export default BuyPageHistory;
