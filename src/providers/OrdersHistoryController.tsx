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
  ordersHistoryStoreActions,
  selectUserStore,
} from '../store';
import { getBuyerOrdersRequest, refreshBuyerOrdersRequest } from '../services';
import { addGsheetRowRequest } from '../services/gsheetServices';

// Context props
type ContextProps = {
  handleFetchMoreOrdersAction: () => void;
  handleOrdersRefreshAction: () => void;
  handleEmailSubmitAction: (
    email: string,
    orderId: string,
    walletAddress: string
  ) => Promise<boolean>;
};

export const OrdersHistoryContext = createContext<ContextProps>({
  handleFetchMoreOrdersAction: () => {},
  handleOrdersRefreshAction: () => {},
  handleEmailSubmitAction: async () => false,
});

type OrdersHistoryControllerProps = {
  children: React.ReactNode;
};

export const OrdersHistoryController = ({
  children,
}: OrdersHistoryControllerProps) => {
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector(selectUserStore);
  const limit = 10;
  const [offset, setOffset] = useState(limit);

  const fetchOrders = useCallback(
    async (accessToken: string) => {
      dispatch(ordersHistoryStoreActions.setLoading(true));
      const res = await getBuyerOrdersRequest(accessToken, limit, 0);
      dispatch(ordersHistoryStoreActions.setItems(res?.items || []));
      dispatch(ordersHistoryStoreActions.setTotal(res?.total || 0));
      dispatch(ordersHistoryStoreActions.setLoading(false));
    },
    [dispatch]
  );

  const handleFetchMoreOrdersAction = useCallback(async () => {
    const res = await getBuyerOrdersRequest(accessToken, limit, offset);
    setOffset(offset + limit);
    dispatch(ordersHistoryStoreActions.addItems(res?.items || []));
  }, [accessToken, offset, dispatch]);

  const handleOrdersRefreshAction = useCallback(async () => {
    dispatch(ordersHistoryStoreActions.setRefreshing(true));
    const refreshedOrders = await refreshBuyerOrdersRequest(accessToken).catch(
      (error: any) => {
        dispatch(ordersHistoryStoreActions.setRefreshing(false));
      }
    );
    if (refreshedOrders) {
      for (const order of refreshedOrders) {
        dispatch(ordersHistoryStoreActions.updateItem(order));
      }
    }
    dispatch(ordersHistoryStoreActions.setRefreshing(false));
  }, [accessToken, dispatch]);

  const handleEmailSubmitAction = useCallback(
    async (
      email: string,
      orderId: string,
      walletAddress: string
    ): Promise<boolean> => {
      let res;
      try {
        res = await addGsheetRowRequest(accessToken, {
          email,
          walletAddress,
          orderId,
        });
      } catch (error: any) {
        console.error('handleEmailSubmitAction error:', error);
        return false;
      }
      return res;
    },
    [accessToken]
  );

  useEffect(() => {
    if (accessToken) {
      fetchOrders(accessToken);
    }
  }, [accessToken, fetchOrders]);

  return (
    <OrdersHistoryContext.Provider
      value={{
        handleFetchMoreOrdersAction,
        handleOrdersRefreshAction,
        handleEmailSubmitAction,
      }}
    >
      {children}
    </OrdersHistoryContext.Provider>
  );
};

export const useOrdersHistoryController = () =>
  useContext(OrdersHistoryContext);

export default OrdersHistoryController;
