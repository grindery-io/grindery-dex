import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import {
  useAppDispatch,
  useAppSelector,
  setOrdersHistoryItems,
  setOrdersHistoryLoading,
  selectUserAccessToken,
} from '../store';
import { getBuyerOrdersRequest, getOfferById } from '../services';
import { OrderType, OfferType } from '../types';

// Context props
type ContextProps = {};

export const OrdersHistoryContext = createContext<ContextProps>({});

type OrdersHistoryControllerProps = {
  children: React.ReactNode;
};

export const OrdersHistoryController = ({
  children,
}: OrdersHistoryControllerProps) => {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector(selectUserAccessToken);

  const fetchOrders = useCallback(
    async (accessToken: string) => {
      dispatch(setOrdersHistoryLoading(true));
      const orders = await getBuyerOrdersRequest(accessToken).catch(
        (error: any) => {
          // TODO handle orders fetching error
        }
      );
      if (orders) {
        const promises = orders.map(async (order: OrderType) => {
          const offer = await getOfferById(
            accessToken,
            order.offerId || ''
          ).catch(() => {
            return null;
          });
          return offer || null;
        });
        const offers = await Promise.all(promises);

        const enrichedOrders = orders.map((order: OrderType) => ({
          ...order,
          offer:
            offers.find(
              (offer: OfferType | null) =>
                offer && offer.offerId === order.offerId
            ) || undefined,
        }));
        dispatch(setOrdersHistoryItems(enrichedOrders));
      }
      dispatch(setOrdersHistoryLoading(false));
    },
    [dispatch]
  );

  useEffect(() => {
    if (accessToken) {
      fetchOrders(accessToken);
    }
  }, [accessToken, fetchOrders]);

  return (
    <OrdersHistoryContext.Provider value={{}}>
      {children}
    </OrdersHistoryContext.Provider>
  );
};

export const useOrdersHistoryController = () =>
  useContext(OrdersHistoryContext);

export default OrdersHistoryController;
