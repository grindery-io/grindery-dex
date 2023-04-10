import React from 'react';
import { Box } from '@mui/system';
import {
  OrderCard,
  NotFound,
  OrderSkeleton,
  PageCardHeader,
  PageCardBody,
} from '../../components';
import { OrderType, LiquidityWalletType } from '../../types';
import {
  useAppSelector,
  selectOrdersError,
  selectOrdersItems,
  selectOrdersLoading,
  selectUserAccessToken,
  selectUserChainId,
  selectLiquidityWalletAbi,
  selectChainsItems,
  selectWalletsItems,
} from '../../store';
import { sortOrdersByDate } from '../../utils';
import { useOrdersController } from '../../controllers';

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
      <PageCardHeader title="Orders" />
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
      </PageCardBody>
    </>
  );
}

export default OrdersPageRoot;
