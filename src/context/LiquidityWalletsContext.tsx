import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import { useGrinderyNexus } from 'use-grindery-nexus';
import { DELIGHT_API_URL } from '../constants';
import { LiquidityWallet } from '../types/LiquidityWallet';
import { getErrorMessage } from '../utils/error';

// Context props
type ContextProps = {
  isLoading: boolean;
  wallets: LiquidityWallet[];
  error: string;
  setWallets: React.Dispatch<React.SetStateAction<LiquidityWallet[]>>;
  saveWallet: (body: {
    [key: string]: any;
  }) => Promise<LiquidityWallet | boolean>;
  updateWallet: (body: { [key: string]: any }) => Promise<boolean>;
  getWallet: (id: string) => Promise<any>;
  getWalletBalance: (
    tokenAddress: string,
    address: string,
    chainId?: string
  ) => Promise<any>;
};

// Context provider props
type LiquidityWalletsContextProps = {
  children: React.ReactNode;
};

// Init context
export const LiquidityWalletsContext = createContext<ContextProps>({
  isLoading: true,
  wallets: [],
  error: '',
  setWallets: () => {},
  saveWallet: async () => false,
  updateWallet: async () => false,
  getWallet: async () => false,
  getWalletBalance: async () => false,
});

export const LiquidityWalletsContextProvider = ({
  children,
}: LiquidityWalletsContextProps) => {
  const { token } = useGrinderyNexus();
  const [isLoading, setIsLoading] = useState(true);
  const [wallets, setWallets] = useState<LiquidityWallet[]>([]);
  const [error, setError] = useState('');

  const params = {
    headers: {
      Authorization: `Bearer ${token?.access_token || ''}`,
    },
  };

  const getWallet = async (id: string) => {
    let res;
    try {
      res = await axios.get(
        `${DELIGHT_API_URL}/liquidity-wallets/id/${id}`,
        params
      );
    } catch (error: any) {
      setError(getErrorMessage(error, 'Server error'));
    }
    return res?.data || false;
  };

  const getWalletBalance = async (
    tokenAddress: string,
    address: string,
    chainId?: string
  ) => {
    let res;
    try {
      res = await axios.get(
        `${DELIGHT_API_URL}/view-blockchains/balance-token?chainId=${chainId}&tokenAddress=${tokenAddress}&address=${address}`,
        params
      );
    } catch (error: any) {
      setError(getErrorMessage(error, 'Server error'));
    }
    return res?.data || false;
  };

  const getWallets = async () => {
    setError('');
    let res;
    try {
      res = await axios.get(`${DELIGHT_API_URL}/liquidity-wallets/all`, params);
    } catch (error: any) {
      setError(getErrorMessage(error, 'Server error'));
    }
    setWallets(res?.data || []);
    setIsLoading(false);
  };

  const saveWallet = async (body: { [key: string]: any }) => {
    setError('');
    let res;
    try {
      res = await axios.post(
        `${DELIGHT_API_URL}/liquidity-wallets/`,
        body,
        params
      );
    } catch (error: any) {
      setError(getErrorMessage(error, 'Server error'));
    }

    if (res?.data?.insertedId) {
      const wallet = await getWallet(res?.data?.insertedId);
      if (wallet) {
        return wallet;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const updateWallet = async (body: { [key: string]: any }) => {
    setError('');
    let res;
    try {
      res = await axios.put(
        `${DELIGHT_API_URL}/liquidity-wallets`,
        body,
        params
      );
    } catch (error: any) {
      setError(getErrorMessage(error, 'Server error'));
    }

    if (res?.data?.modifiedCount) {
      getWallets();
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    if (token?.access_token) {
      getWallets();
    }
  }, [token?.access_token]);

  return (
    <LiquidityWalletsContext.Provider
      value={{
        isLoading,
        wallets,
        setWallets,
        error,
        saveWallet,
        updateWallet,
        getWallet,
        getWalletBalance,
      }}
    >
      {children}
    </LiquidityWalletsContext.Provider>
  );
};

export default LiquidityWalletsContextProvider;
