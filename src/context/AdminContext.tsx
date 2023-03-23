import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import { useGrinderyNexus } from 'use-grindery-nexus';
import { DELIGHT_API_URL } from '../constants';
import { getErrorMessage } from '../utils/error';

// Context props
type ContextProps = {
  isAdmin: boolean;
  isLoading: boolean;
  error: string;
};

// Context provider props
type AdminContextProps = {
  children: React.ReactNode;
};

// Init context
export const AdminContext = createContext<ContextProps>({
  isLoading: true,
  isAdmin: false,
  error: '',
});

export const AdminContextProvider = ({ children }: AdminContextProps) => {
  const { token } = useGrinderyNexus();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAmin] = useState(false);
  const [error, setError] = useState('');

  const params = {
    headers: {
      Authorization: `Bearer ${token?.access_token || ''}`,
    },
  };

  const checkIsAdmin = async () => {
    setIsLoading(true);
    let res;
    try {
      res = await axios.get(`${DELIGHT_API_URL}/admins`, params);
    } catch (error: any) {
      setError(getErrorMessage(error, 'Server error'));
      setIsAmin(false);
      setIsLoading(false);
    }
    if (res?.data) {
      setIsAmin(true);
      setIsLoading(false);
    } else {
      setIsAmin(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token?.access_token) {
      checkIsAdmin();
    }
  }, [token?.access_token]);

  return (
    <AdminContext.Provider
      value={{
        isLoading,
        error,
        isAdmin,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
