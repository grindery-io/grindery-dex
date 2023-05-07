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
import { getBuyerOrdersRequest } from '../services';

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
  const { accessToken } = useAppSelector(selectUserStore);
  const limit = 5;
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

  useEffect(() => {
    if (accessToken) {
      fetchOrders(accessToken);
    }
  }, [accessToken, fetchOrders]);

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
