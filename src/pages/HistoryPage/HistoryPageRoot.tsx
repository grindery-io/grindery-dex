import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  PageCardHeader,
  PageCardBody,
  PageCard,
  OrderHistoryCard,
  OrderSkeleton,
  NotFound,
  Loading,
} from '../../components';
import { OrderType } from '../../types';
import {
  useAppSelector,
  selectChainsStore,
  selectOrdersHistoryStore,
  selectUserStore,
} from '../../store';
import { useOrdersHistoryController } from '../../providers';
import Page404 from '../Page404/Page404';
import { IconButton, Tooltip } from '@mui/material';

type Props = {};

const HistoryPageRoot = (props: Props) => {
  const {
    items: orders,
    loading,
    total,
    refreshing,
  } = useAppSelector(selectOrdersHistoryStore);
  const {
    id: user,
    accessToken,
    advancedMode,
  } = useAppSelector(selectUserStore);
  const { items: chains } = useAppSelector(selectChainsStore);
  const { handleFetchMoreOrdersAction, handleOrdersRefreshAction } =
    useOrdersHistoryController();
  const hasMore = orders.length < total;

  return accessToken ? (
    <PageCard>
      <PageCardHeader
        title="Orders history"
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
      <PageCardBody maxHeight="540px" id="history-orders-list">
        {!loading && orders.length < 1 && <NotFound text="No orders found" />}
        {loading ? (
          <OrderSkeleton />
        ) : (
          <InfiniteScroll
            dataLength={orders.length}
            next={handleFetchMoreOrdersAction}
            hasMore={hasMore}
            loader={<OrderSkeleton />}
            scrollableTarget="history-orders-list"
          >
            {orders.map((order: OrderType) => (
              <OrderHistoryCard
                advancedMode={advancedMode}
                key={order._id}
                chains={chains}
                order={order}
              />
            ))}
          </InfiniteScroll>
        )}
      </PageCardBody>
    </PageCard>
  ) : (
    <Page404 />
  );
};

export default HistoryPageRoot;
