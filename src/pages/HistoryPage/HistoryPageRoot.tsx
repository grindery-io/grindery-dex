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
  selectOrdersHistoryItems,
  selectChainsItems,
  selectUserAdvancedMode,
  selectUserAccessToken,
  selectOrdersHistoryHasMore,
  selectOrdersHistoryLoading,
} from '../../store';
import { useOrdersHistoryController } from '../../providers';
import Page404 from '../Page404/Page404';

type Props = {};

const HistoryPageRoot = (props: Props) => {
  const orders = useAppSelector(selectOrdersHistoryItems);
  const accessToken = useAppSelector(selectUserAccessToken);
  const chains = useAppSelector(selectChainsItems);
  const advancedMode = useAppSelector(selectUserAdvancedMode);
  const { handleFetchMoreOrdersAction } = useOrdersHistoryController();
  const hasMore = useAppSelector(selectOrdersHistoryHasMore);
  const loading = useAppSelector(selectOrdersHistoryLoading);

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
