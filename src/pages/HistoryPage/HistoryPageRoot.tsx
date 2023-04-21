import React from 'react';
import { Box } from '@mui/system';
import {
  OrderSkeleton,
  NotFound,
  PageCardHeader,
  PageCardBody,
  PageCard,
  OrderHistoryCard,
} from '../../components';
import { OrderType } from '../../types';
import {
  useAppSelector,
  selectOrdersHistoryItems,
  selectOrdersHistoryLoading,
  selectChainsItems,
  selectUserAdvancedMode,
} from '../../store';
import { sortOrdersByDate } from '../../utils';

type Props = {};

const HistoryPageRoot = (props: Props) => {
  const orders = useAppSelector(selectOrdersHistoryItems);
  const isLoading = useAppSelector(selectOrdersHistoryLoading);
  const sortedOrders = sortOrdersByDate(orders);
  const chains = useAppSelector(selectChainsItems);
  const advancedMode = useAppSelector(selectUserAdvancedMode);

  return (
    <PageCard>
      <PageCardHeader title="Orders history" />
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
                  <OrderHistoryCard
                    advancedMode={advancedMode}
                    key={order._id}
                    chains={chains}
                    order={order}
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
    </PageCard>
  );
};

export default HistoryPageRoot;
