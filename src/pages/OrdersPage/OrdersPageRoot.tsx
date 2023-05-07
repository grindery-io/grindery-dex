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
  selectOrdersStore,
  selectAbiStore,
  selectChainsStore,
  selectWalletsStore,
  selectUserStore,
} from '../../store';
import { useOrdersProvider } from '../../providers';

function OrdersPageRoot() {
  const { accessToken, chainId: userChainId } = useAppSelector(selectUserStore);
  const { liquidityWalletAbi } = useAppSelector(selectAbiStore);
  const {
    items: orders,
    loading,
    error,
    total,
  } = useAppSelector(selectOrdersStore);
  const hasMore = orders.length < total;
  const { handleOrderCompleteAction } = useOrdersProvider();
  const { items: wallets } = useAppSelector(selectWalletsStore);
  const { items: chains } = useAppSelector(selectChainsStore);
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
