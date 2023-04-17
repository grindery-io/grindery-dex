import React from 'react';
import { Box } from '@mui/system';
import {
  OrderSkeleton,
  OrderCard,
  NotFound,
  PageCardHeader,
  PageCardBody,
  PageCard,
} from '../../components';
import { OrderType } from '../../types';
import {
  useAppSelector,
  selectOrdersHistoryItems,
  selectOrdersHistoryLoading,
  selectChainsItems,
} from '../../store';
import { sortOrdersByDate } from '../../utils';

type Props = {};

const HistoryPageRoot = (props: Props) => {
  const orders = useAppSelector(selectOrdersHistoryItems);
  const isLoading = useAppSelector(selectOrdersHistoryLoading);
  const sortedOrders = sortOrdersByDate(orders);
  const chains = useAppSelector(selectChainsItems);

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
                  <OrderCard
                    key={order._id}
                    chains={chains}
                    order={order}
                    userType="a"
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
