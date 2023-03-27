import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import { useGrinderyNexus } from 'use-grindery-nexus';
import { DELIGHT_API_URL } from '../constants';
import { Trade } from '../types/Trade';
import { getErrorMessage } from '../utils/error';

// Context props
type ContextProps = {
  isLoading: boolean;
  trades: Trade[];
  error: string;
  setTrades: React.Dispatch<React.SetStateAction<Trade[]>>;
  saveTrade: (body: { [key: string]: any }) => Promise<Trade | boolean>;
  getTrades: () => void;
  completeTrade: (tradeId: string) => Promise<boolean>;
};

// Context provider props
type TradesContextProps = {
  children: React.ReactNode;
};

// Init context
export const TradesContext = createContext<ContextProps>({
  isLoading: true,
  trades: [],
  error: '',
  setTrades: () => {},
  saveTrade: async () => false,
  getTrades: () => {},
  completeTrade: async () => false,
});

export const TradesContextProvider = ({ children }: TradesContextProps) => {
  const { token } = useGrinderyNexus();
  const [isLoading, setIsLoading] = useState(true);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [error, setError] = useState('');

  const params = {
    headers: {
      Authorization: `Bearer ${token?.access_token || ''}`,
    },
  };

  const getTrade = async (id: string) => {
    let res;
    try {
      res = await axios.get(`${DELIGHT_API_URL}/trades/id?id=${id}`, params);
    } catch (error: any) {
      setError(getErrorMessage(error, 'Server error'));
    }
    return res?.data || false;
  };

  const getTrades = async () => {
    setIsLoading(true);
    setError('');
    let res;
    try {
      res = await axios.get(`${DELIGHT_API_URL}/trades/user`, params);
    } catch (error: any) {
      setError(getErrorMessage(error, 'Server error'));
    }
    setTrades(res?.data || []);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  const saveTrade = async (body: { [key: string]: any }) => {
    setIsLoading(true);
    setError('');
    let res;
    try {
      res = await axios.post(`${DELIGHT_API_URL}/trades`, body, params);
    } catch (error: any) {
      setError(getErrorMessage(error, 'Server error'));
    }

    if (res?.data?.insertedId) {
      const trade = await getTrade(res?.data?.insertedId);
      setIsLoading(false);
      if (trade) {
        return trade;
      } else {
        return false;
      }
    } else {
      setIsLoading(false);
      return false;
    }
  };

  const completeTrade = async (tradeId: string): Promise<boolean> => {
    setError('');
    let res;
    try {
      res = await axios.put(
        `${DELIGHT_API_URL}/trades/complete`,
        { tradeId: tradeId, isComplete: true },
        params
      );
    } catch (error: any) {
      setError(getErrorMessage(error, 'Server error'));
    }

    if (res?.data?.modifiedCount) {
      let res2;
      try {
        res2 = await axios.get(`${DELIGHT_API_URL}/trades/user`, params);
      } catch (error: any) {
        setError(getErrorMessage(error, 'Server error'));
      }
      setTrades(res2?.data || []);
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    if (token?.access_token) {
      getTrades();
    }
  }, [token?.access_token]);

  return (
    <TradesContext.Provider
      value={{
        isLoading,
        trades,
        error,
        setTrades,
        saveTrade,
        getTrades,
        completeTrade,
      }}
    >
      {children}
    </TradesContext.Provider>
  );
};

export default TradesContextProvider;
