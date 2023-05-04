import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  useAppDispatch,
  useAppSelector,
  setOrdersHistoryItems,
  setOrdersHistoryLoading,
  selectUserAccessToken,
  addOrdersHistoryItems,
  setOrdersHistoryTotal,
  updateOrderItem,
} from '../store';
import { getBuyerOrdersRequest, getOrderRequest } from '../services';
import { JSONRPCRequestType } from '../types';
import { getNotificationObject } from '../utils';
import { enqueueSnackbar } from 'notistack';
import { selectMessagesItems } from '../store/slices/messagesSlice';

// Context props
type ContextProps = {
  handleFetchMoreOrdersAction: () => void;
};

export const OrdersHistoryContext = createContext<ContextProps>({
  handleFetchMoreOrdersAction: () => {},
});

type OrdersHistoryControllerProps = {
  children: React.ReactNode;
};

export const OrdersHistoryController = ({
  children,
}: OrdersHistoryControllerProps) => {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector(selectUserAccessToken);
  const limit = 5;
  const [offset, setOffset] = useState(limit);
  const messages = useAppSelector(selectMessagesItems);

  const fetchOrders = useCallback(
    async (accessToken: string) => {
      dispatch(setOrdersHistoryLoading(true));
      const res = await getBuyerOrdersRequest(accessToken, limit, 0);
      dispatch(setOrdersHistoryItems(res?.items || []));
      dispatch(setOrdersHistoryTotal(res?.total || 0));
      dispatch(setOrdersHistoryLoading(false));
    },
    [dispatch]
  );

  const handleFetchMoreOrdersAction = useCallback(async () => {
    const res = await getBuyerOrdersRequest(accessToken, limit, offset);
    setOffset(offset + limit);
    dispatch(addOrdersHistoryItems(res?.items || []));
  }, [accessToken, offset, dispatch]);

  const fetchOrder = useCallback(
    async (id: string) => {
      const order = await getOrderRequest(accessToken, id);
      return order;
    },
    [accessToken]
  );

  const refreshOrder = useCallback(
    async (event: JSONRPCRequestType) => {
      if (event?.params?.type === 'order' && event?.params?.id) {
        const offer = await fetchOrder(event.params.id);
        if (offer) {
          dispatch(updateOrderItem(offer));
          const notification = getNotificationObject(event);
          if (notification) {
            enqueueSnackbar(notification.text, notification.props);
          }
        }
      }
    },
    [fetchOrder, dispatch]
  );

  useEffect(() => {
    if (accessToken) {
      fetchOrders(accessToken);
    }
  }, [accessToken, fetchOrders]);

  useEffect(() => {
    const allMessages = [...messages];
    const lastMessage = allMessages.pop();
    refreshOrder(lastMessage);
  }, [messages, refreshOrder]);

  return (
    <OrdersHistoryContext.Provider
      value={{
        handleFetchMoreOrdersAction,
      }}
    >
      {children}
    </OrdersHistoryContext.Provider>
  );
};

export const useOrdersHistoryController = () =>
  useContext(OrdersHistoryContext);

export default OrdersHistoryController;
