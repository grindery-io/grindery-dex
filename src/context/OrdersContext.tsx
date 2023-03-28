import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import { useGrinderyNexus } from 'use-grindery-nexus';
import { DELIGHT_API_URL } from '../constants';
import { OrderType } from '../types/Order';
import { getErrorMessage } from '../utils/error';

// Context props
type ContextProps = {
  isLoading: boolean;
  orders: OrderType[];
  ordersB: OrderType[];
  error: string;
  setOrders: React.Dispatch<React.SetStateAction<OrderType[]>>;
  setOrdersB: React.Dispatch<React.SetStateAction<OrderType[]>>;
  saveOrder: (body: { [key: string]: any }) => Promise<OrderType | boolean>;
  getOrders: () => void;
  completeOrder: (orderId: string) => Promise<boolean>;
};

// Context provider props
type OrdersContextProps = {
  children: React.ReactNode;
  userType?: 'a' | 'b';
};

// Init context
export const OrdersContext = createContext<ContextProps>({
  isLoading: true,
  orders: [],
  ordersB: [],
  error: '',
  setOrders: () => {},
  setOrdersB: () => {},
  saveOrder: async () => false,
  getOrders: () => {},
  completeOrder: async () => false,
});

export const OrdersContextProvider = ({
  children,
  userType,
}: OrdersContextProps) => {
  const { token } = useGrinderyNexus();
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [ordersB, setOrdersB] = useState<OrderType[]>([]);
  const [error, setError] = useState('');

  const params = {
    headers: {
      Authorization: `Bearer ${token?.access_token || ''}`,
    },
  };

  const getOrder = async (id: string) => {
    let res;
    try {
      res = await axios.get(`${DELIGHT_API_URL}/orders/id?id=${id}`, params);
    } catch (error: any) {
      setError(getErrorMessage(error, 'Server error'));
    }
    return res?.data || false;
  };

  const getOrders = async () => {
    setIsLoading(true);
    setError('');
    let res;
    try {
      res = await axios.get(`${DELIGHT_API_URL}/orders/user`, params);
    } catch (error: any) {
      setError(getErrorMessage(error, 'Server error'));
    }
    setOrders(res?.data || []);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  const getOrdersB = async () => {
    setIsLoading(true);
    setError('');
    let res;
    try {
      res = await axios.get(
        `${DELIGHT_API_URL}/orders/liquidity-provider`,
        params
      );
    } catch (error: any) {
      setError(getErrorMessage(error, 'Server error'));
    }
    setOrdersB(res?.data || []);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  const saveOrder = async (body: { [key: string]: any }) => {
    setIsLoading(true);
    setError('');
    let res;
    try {
      res = await axios.post(`${DELIGHT_API_URL}/orders`, body, params);
    } catch (error: any) {
      setError(getErrorMessage(error, 'Server error'));
    }

    if (res?.data?.insertedId) {
      const order = await getOrder(res?.data?.insertedId);
      setIsLoading(false);
      if (order) {
        return order;
      } else {
        return false;
      }
    } else {
      setIsLoading(false);
      return false;
    }
  };

  const completeOrder = async (orderId: string): Promise<boolean> => {
    setError('');
    let res;
    try {
      res = await axios.put(
        `${DELIGHT_API_URL}/orders/complete`,
        { orderId: orderId, isComplete: true },
        params
      );
    } catch (error: any) {
      setError(getErrorMessage(error, 'Server error'));
    }

    if (res?.data?.modifiedCount) {
      let res2;
      try {
        res2 = await axios.get(
          `${DELIGHT_API_URL}/orders/liquidity-provider`,
          params
        );
      } catch (error: any) {
        setError(getErrorMessage(error, 'Server error'));
      }
      setOrdersB(res2?.data || []);
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    if (token?.access_token) {
      getOrders();
    }
  }, [token?.access_token]);

  useEffect(() => {
    if (token?.access_token && userType && userType === 'b') {
      getOrdersB();
    }
  }, [token?.access_token, userType]);

  return (
    <OrdersContext.Provider
      value={{
        isLoading,
        orders,
        ordersB,
        error,
        setOrders,
        setOrdersB,
        saveOrder,
        getOrders,
        completeOrder,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export default OrdersContextProvider;
