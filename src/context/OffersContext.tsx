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
  searchOffers: (silent: boolean, query?: string) => void;
  getOfferById: (offerId: string) => Promise<Offer | false>;
  getAllOffers: () => void;
};

// Context provider props
type OffersContextProps = {
  children: React.ReactNode;
  userType: 'a' | 'b';
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
  getOfferById: async () => false,
  getAllOffers: () => {},
});

export const OffersContextProvider = ({
  children,
  userType,
}: OffersContextProps) => {
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

  const getOfferById = async (offerId: string): Promise<Offer | false> => {
    let res;
    try {
      res = await axios.get(
        `${DELIGHT_API_URL}/offers/offerId?offerId=${offerId}`,
        params
      );
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

  const getAllOffers = async () => {
    setError('');
    let res;
    try {
      res = await axios.get(`${DELIGHT_API_URL}/offers`, params);
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
    const offer = offers.find((o: Offer) => o.offerId === id);
    setError('');
    let res;
    try {
      res = await axios.put(
        `${DELIGHT_API_URL}/offers/${id}`,
        { offerId: id, isActive: !offer?.isActive },
        params
      );
    } catch (error: any) {
      setError(getErrorMessage(error, 'Server error'));
    }

    if (res?.data?.modifiedCount) {
      return true;
    } else {
      return false;
    }
  };

  const searchOffers = async (silent: boolean = false, query?: string) => {
    setError('');
    if (!silent) {
      setIsLoading(true);
    }

    let res;
    try {
      res = await axios.get(`${DELIGHT_API_URL}/offers/search${query}`, params);
    } catch (error: any) {
      setError(getErrorMessage(error, 'Server error'));
      setIsLoading(false);
      setOffers([]);
      return;
    }
    console.log('setOffers', res?.data || []);

    setOffers(res?.data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    if (token?.access_token && userType && userType === 'b') {
      getOffers();
    }
  }, [token?.access_token, userType]);

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
        getOfferById,
        getAllOffers,
      }}
    >
      {children}
    </OffersContext.Provider>
  );
};

export default OffersContextProvider;
