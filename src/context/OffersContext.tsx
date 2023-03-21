import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import { useGrinderyNexus } from 'use-grindery-nexus';
import { DELIGHT_API_URL } from '../constants';
import { Offer } from '../types/Offer';
import { getErrorMessage } from '../utils/error';

// Context props
type ContextProps = {
  isLoading: boolean;
  offers: Offer[];
  error: string;
  setOffers: React.Dispatch<React.SetStateAction<Offer[]>>;
  saveOffer: (body: { [key: string]: any }) => Promise<Offer | boolean>;
  updateOffer: (id: string) => Promise<boolean>;
  searchOffers: () => void;
};

// Context provider props
type OffersContextProps = {
  children: React.ReactNode;
};

// Init context
export const OffersContext = createContext<ContextProps>({
  isLoading: true,
  offers: [],
  error: '',
  setOffers: () => {},
  saveOffer: async () => false,
  updateOffer: async () => false,
  searchOffers: async () => {},
});

export const OffersContextProvider = ({ children }: OffersContextProps) => {
  const { token } = useGrinderyNexus();
  const [isLoading, setIsLoading] = useState(true);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [error, setError] = useState('');

  const params = {
    headers: {
      Authorization: `Bearer ${token?.access_token || ''}`,
    },
  };

  const getOffer = async (id: string) => {
    let res;
    try {
      res = await axios.get(`${DELIGHT_API_URL}/offers/id?id=${id}`, params);
    } catch (error: any) {
      setError(getErrorMessage(error, 'Server error'));
    }
    return res?.data || false;
  };

  const getOffers = async () => {
    setError('');
    let res;
    try {
      res = await axios.get(`${DELIGHT_API_URL}/offers/user`, params);
    } catch (error: any) {
      setError(getErrorMessage(error, 'Server error'));
    }
    setOffers(res?.data || []);
    setIsLoading(false);
  };

  const saveOffer = async (body: { [key: string]: any }) => {
    setError('');
    let res;
    try {
      res = await axios.post(`${DELIGHT_API_URL}/offers`, body, params);
    } catch (error: any) {
      setError(getErrorMessage(error, 'Server error'));
    }
    if (res?.data?.insertedId) {
      const offer = await getOffer(res?.data?.insertedId);
      if (offer) {
        return offer;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const updateOffer = async (id: string) => {
    setError('');
    let res;
    try {
      res = await axios.put(`${DELIGHT_API_URL}/offers/${id}`, {}, params);
    } catch (error: any) {
      setError(getErrorMessage(error, 'Server error'));
    }

    if (res?.data?.modifiedCount) {
      return true;
    } else {
      return false;
    }
  };

  const searchOffers = async () => {
    setError('');
    setIsLoading(true);
    let res;
    try {
      res = await axios.get(`${DELIGHT_API_URL}/offers`, params);
    } catch (error: any) {
      setError(getErrorMessage(error, 'Server error'));
      setIsLoading(false);
      setOffers([]);
      return;
    }
    setOffers(res?.data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    if (token?.access_token) {
      getOffers();
    }
  }, [token?.access_token]);

  return (
    <OffersContext.Provider
      value={{
        isLoading,
        offers,
        error,
        setOffers,
        saveOffer,
        updateOffer,
        searchOffers,
      }}
    >
      {children}
    </OffersContext.Provider>
  );
};

export default OffersContextProvider;
