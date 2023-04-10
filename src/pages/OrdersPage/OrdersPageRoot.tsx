import React from 'react';
import DexCardHeader from '../../components/DexCard/DexCardHeader';
import DexCardBody from '../../components/DexCard/DexCardBody';
import OrderCard from '../../components/OrderCard/OrderCard';
import { Box } from '@mui/system';
import NotFound from '../../components/NotFound/NotFound';
import OrderSkeleton from '../../components/OrderCard/OrderSkeleton';
import { OrderType } from '../../types/OrderType';
import { useAppSelector } from '../../store/storeHooks';
import {
  selectOrdersError,
  selectOrdersItems,
  selectOrdersLoading,
} from '../../store/slices/ordersSlice';
import { sortOrdersByDate } from '../../utils/helpers/orderHelpers';
import { useOrdersController } from '../../controllers/OrdersController';
import {
  selectUserAccessToken,
  selectUserChainId,
} from '../../store/slices/userSlice';
import { selectLiquidityWalletAbi } from '../../store/slices/abiSlice';
import { LiquidityWalletType } from '../../types/LiquidityWalletType';
import { selectChainsItems } from '../../store/slices/chainsSlice';
import { selectWalletsItems } from '../../store/slices/walletsSlice';

function OrdersPageRoot() {
  const accessToken = useAppSelector(selectUserAccessToken);
  const userChainId = useAppSelector(selectUserChainId);
  const liquidityWalletAbi = useAppSelector(selectLiquidityWalletAbi);
  const orders = useAppSelector(selectOrdersItems);
  const isLoading = useAppSelector(selectOrdersLoading);
  const error = useAppSelector(selectOrdersError);
  const sortedOrders = sortOrdersByDate(orders);
  const { handleOrderCompleteAction } = useOrdersController();
  const wallets = useAppSelector(selectWalletsItems);
  const chains = useAppSelector(selectChainsItems);

  return (
    <>
      <DexCardHeader title="Orders" />
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
                    order={order}
                    userType="b"
                    chains={chains}
                    onCompleteClick={async (order: OrderType) => {
                      const wallet = wallets.find(
                        (w: LiquidityWalletType) =>
                          w.chainId === order.offer?.chainId || ''
                      );
                      return await handleOrderCompleteAction(
                        order,
                        accessToken,
                        wallet?.walletAddress || '',
                        userChainId,
                        liquidityWalletAbi,
                        orders
                      );
                    }}
                    error={
                      error.type && error.type === order.orderId && error.text
                        ? error.text
                        : ''
                    }
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
    </>
  );
}

export default OrdersPageRoot;
