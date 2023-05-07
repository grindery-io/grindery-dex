import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  PageCardHeader,
  PageCardBody,
  PageCard,
  OrderHistoryCard,
  OrderSkeleton,
  NotFound,
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

type Props = {};

const HistoryPageRoot = (props: Props) => {
  const {
    items: orders,
    loading,
    total,
  } = useAppSelector(selectOrdersHistoryStore);
  const { accessToken, advancedMode } = useAppSelector(selectUserStore);
  const { items: chains } = useAppSelector(selectChainsStore);
  const { handleFetchMoreOrdersAction } = useOrdersHistoryController();
  const hasMore = orders.length < total;

  return accessToken ? (
    <PageCard>
      <PageCardHeader title="Orders history" />
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
