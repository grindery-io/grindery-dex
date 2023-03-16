import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import { useGrinderyNexus } from 'use-grindery-nexus';
import { DELIGHT_API_URL } from '../constants';
import { Stake } from '../types/Stake';
import { getErrorMessage } from '../utils/error';

// Context props
type ContextProps = {
  isLoading: boolean;
  stakes: Stake[];
  error: string;
  setStakes: React.Dispatch<React.SetStateAction<Stake[]>>;
  addStake: (body: { [key: string]: any }) => Promise<Stake | boolean>;
  updateStake: (body: { chainId: string; amount: string }) => Promise<boolean>;
};

// Context provider props
type StakesContextProps = {
  children: React.ReactNode;
};

// Init context
export const StakesContext = createContext<ContextProps>({
  isLoading: true,
  stakes: [],
  error: '',
  setStakes: () => {},
  addStake: async () => false,
  updateStake: async () => false,
});

export const StakesContextProvider = ({ children }: StakesContextProps) => {
  const { token } = useGrinderyNexus();
  const [isLoading, setIsLoading] = useState(true);
  const [stakes, setStakes] = useState<Stake[]>([]);
  const [error, setError] = useState('');

  const params = {
    headers: {
      Authorization: `Bearer ${token?.access_token || ''}`,
    },
  };

  const getStake = async (id: string) => {
    let res;
    try {
      res = await axios.get(`${DELIGHT_API_URL}/staking/${id}`, params);
    } catch (error: any) {
      setError(getErrorMessage(error, 'Server error'));
    }
    return res?.data || false;
  };

  const getStakes = async () => {
    setError('');
    let res;
    try {
      res = await axios.get(`${DELIGHT_API_URL}/staking/user`, params);
    } catch (error: any) {
      setError(getErrorMessage(error, 'Server error'));
    }
    setStakes(res?.data || []);
    setIsLoading(false);
  };

  const addStake = async (body: { [key: string]: any }) => {
    setError('');
    let res;
    try {
      res = await axios.post(`${DELIGHT_API_URL}/staking`, body, params);
    } catch (error: any) {
      setError(getErrorMessage(error, 'Server error'));
    }
    if (res?.data?.insertedId) {
      const stake = await getStake(res?.data?.insertedId);
      if (stake) {
        return stake;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const updateStake = async ({
    chainId,
    amount,
  }: {
    chainId: string;
    amount: string;
  }) => {
    setError('');
    let res;
    try {
      res = await axios.post(
        `${DELIGHT_API_URL}/staking/modify/chainId/${chainId}/amount/${amount}`,
        {},
        params
      );
    } catch (error: any) {
      setError(getErrorMessage(error, 'Server error'));
    }
    if (res?.data) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    if (token?.access_token) {
      getStakes();
    }
  }, [token?.access_token]);

  return (
    <StakesContext.Provider
      value={{
        isLoading,
        stakes,
        setStakes,
        addStake,
        updateStake,
        error,
      }}
    >
      {children}
    </StakesContext.Provider>
  );
};

export default StakesContextProvider;
