import React, { createContext, useEffect, useContext } from 'react';
import { useGrinderyNexus } from 'use-grindery-nexus';
import { useAppDispatch } from '../store/storeHooks';
import {
  setUserAccessToken,
  setUserAddress,
  setUserChain,
  setUserId,
} from '../store/slices/userSlice';

// Context props
type ContextProps = {
  connectUser: () => void;
  disconnectUser: () => void;
  getEthers: () => any;
  getProvider: () => any;
};

// Context provider props
type UserControllerProps = {
  children: React.ReactNode;
};

// Init context
export const UserContext = createContext<ContextProps>({
  connectUser: () => {},
  disconnectUser: () => {},
  getEthers: () => {},
  getProvider: () => {},
});

export const UserController = ({ children }: UserControllerProps) => {
  const { user, address, chain, connect, disconnect, ethers, provider, token } =
    useGrinderyNexus();
  const dispatch = useAppDispatch();

  const connectUser = () => {
    connect();
  };

  const disconnectUser = () => {
    disconnect();
  };

  const getEthers = () => {
    return ethers;
  };

  const getProvider = () => {
    return provider;
  };

  useEffect(() => {
    dispatch(setUserId(user || ''));
  }, [user]);

  useEffect(() => {
    dispatch(setUserAddress(address || ''));
  }, [address]);

  useEffect(() => {
    dispatch(
      setUserChain(
        chain ? (typeof chain === 'number' ? chain.toString() : chain) : ''
      )
    );
  }, [chain]);

  useEffect(() => {
    dispatch(setUserAccessToken(token?.access_token || ''));
  }, [token?.access_token]);

  return (
    <UserContext.Provider
      value={{
        connectUser,
        disconnectUser,
        getEthers,
        getProvider,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserController = () => useContext(UserContext);

export default UserController;
