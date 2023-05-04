import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  OrderCard,
  OrderSkeleton,
  PageCardHeader,
  PageCardBody,
  PageCard,
  NotFound,
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
  selectOrdersHasMore,
} from '../../store';
import { useOrdersProvider } from '../../providers';

function OrdersPageRoot() {
  const accessToken = useAppSelector(selectUserAccessToken);
  const userChainId = useAppSelector(selectUserChainId);
  const liquidityWalletAbi = useAppSelector(selectLiquidityWalletAbi);
  const orders = useAppSelector(selectOrdersItems);
  const error = useAppSelector(selectOrdersError);
  const { handleOrderCompleteAction } = useOrdersProvider();
  const wallets = useAppSelector(selectWalletsItems);
  const chains = useAppSelector(selectChainsItems);
  const hasMore = useAppSelector(selectOrdersHasMore);
  const loading = useAppSelector(selectOrdersLoading);
  const { handleFetchMoreOrdersAction } = useOrdersProvider();

  return (
    <PageCard>
      <PageCardHeader title="Orders" />
      <PageCardBody maxHeight="540px" id="orders-list">
        {!loading && orders.length < 1 && <NotFound text="No orders found" />}
        {loading ? (
          <OrderSkeleton />
        ) : (
          <InfiniteScroll
            dataLength={orders.length}
            next={handleFetchMoreOrdersAction}
            hasMore={hasMore}
            loader={<OrderSkeleton />}
            scrollableTarget="orders-list"
          >
            {orders.map((order: OrderType) => (
              <OrderCard
                key={order._id}
                id={order.orderId}
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
                    orders,
                    chains
                  );
                }}
                error={
                  error.type && error.type === order.orderId && error.text
                    ? error.text
                    : ''
                }
              />
            ))}
          </InfiniteScroll>
        )}
      </PageCardBody>
    </PageCard>
  );
}

export default OrdersPageRoot;
