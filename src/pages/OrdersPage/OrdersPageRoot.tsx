import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  OrderCard,
  OrderSkeleton,
  PageCardHeader,
  PageCardBody,
  PageCard,
  NotFound,
  Loading,
} from '../../components';
import { OrderType } from '../../types';
import {
  useAppSelector,
  selectOrdersStore,
  selectChainsStore,
  selectUserStore,
} from '../../store';
import { useOrdersProvider } from '../../providers';
import { IconButton, Tooltip } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

function OrdersPageRoot() {
  const { id: user } = useAppSelector(selectUserStore);
  const {
    completing,
    items: orders,
    loading,
    error,
    total,
    refreshing,
  } = useAppSelector(selectOrdersStore);
  const hasMore = orders.length < total;
  const { handleOrderCompleteAction } = useOrdersProvider();
  const { items: chains } = useAppSelector(selectChainsStore);
  const { handleFetchMoreOrdersAction, handleOrdersRefreshAction } =
    useOrdersProvider();

  return (
    <PageCard>
      <PageCardHeader
        title="Orders"
        endAdornment={
          user && orders.length > 0 ? (
            <Tooltip title={refreshing ? 'Loading...' : 'Refresh'}>
              <div>
                {refreshing ? (
                  <Loading
                    style={{
                      width: 'auto',
                      margin: 0,
                      padding: '8px 0 8px 8px',
                    }}
                    progressStyle={{
                      width: '20px !important',
                      height: '20px !important',
                    }}
                  />
                ) : (
                  <IconButton
                    size="medium"
                    edge="end"
                    onClick={() => {
                      handleOrdersRefreshAction();
                    }}
                  >
                    <RefreshIcon sx={{ color: 'black' }} />
                  </IconButton>
                )}
              </div>
            </Tooltip>
          ) : null
        }
      />

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
                onCompleteClick={handleOrderCompleteAction}
                error={
                  error.type && error.type === order.orderId && error.text
                    ? error.text
                    : ''
                }
                completing={completing}
              />
            ))}
          </InfiniteScroll>
        )}
      </PageCardBody>
    </PageCard>
  );
}

export default OrdersPageRoot;
