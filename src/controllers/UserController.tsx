import React, {
  createContext,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import { useGrinderyNexus } from 'use-grindery-nexus';
import { useAppDispatch } from '../store/storeHooks';
import {
  setUserAccessToken,
  setUserAddress,
  setUserChain,
  setUserId,
  setUserIsAdmin,
  setUserIsAdminLoading,
} from '../store/slices/userSlice';
import { isUserAdmin } from '../services/userServices';
import useAppContext from '../hooks/useAppContext';

// Context props
type ContextProps = {
  connectUser: () => void;
  disconnectUser: () => void;
  getEthers: () => any;
  getProvider: () => any;
  getSigner: () => any;
  getUser: () => any;
  getUserAddress: () => any;
  getAccessAllowed: () => any;
  getVerifying: () => any;
  getClient: () => any;
  getSetIsOptedIn: (isOpted: boolean) => any;
  getIsOptedIn: () => any;
  getChekingOptIn: () => any;
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
  getSigner: () => {},
  getUser: () => {},
  getUserAddress: () => {},
  getAccessAllowed: () => {},
  getVerifying: () => {},
  getClient: () => {},
  getSetIsOptedIn: () => {},
  getIsOptedIn: () => {},
  getChekingOptIn: () => {},
});

export const UserController = ({ children }: UserControllerProps) => {
  const { user, address, chain, connect, disconnect, ethers, provider, token } =
    useGrinderyNexus();
  const {
    accessAllowed,
    verifying,
    client,
    setIsOptedIn,
    isOptedIn,
    chekingOptIn,
  } = useAppContext();
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

  const getSigner = () => {
    const provider = getProvider();
    return provider.getSigner();
  };

  const getUser = () => {
    return user;
  };

  const getUserAddress = () => {
    return address;
  };

  const getAccessAllowed = () => {
    return accessAllowed;
  };

  const getVerifying = () => {
    return verifying;
  };

  const getClient = () => {
    return client;
  };

  const getSetIsOptedIn = (isOpted: boolean) => {
    return setIsOptedIn(isOpted);
  };

  const getIsOptedIn = () => {
    return isOptedIn;
  };

  const getChekingOptIn = () => {
    return chekingOptIn;
  };

  const checkUserIsAdmin = useCallback(
    async (accessToken: string) => {
      dispatch(setUserIsAdminLoading(true));
      const res = await isUserAdmin(accessToken);
      dispatch(setUserIsAdmin(res));
      dispatch(setUserIsAdminLoading(false));
    },
    [dispatch]
  );

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

  useEffect(() => {
    if (token?.access_token) {
      checkUserIsAdmin(token?.access_token);
    }
  }, [token?.access_token, checkUserIsAdmin]);

  return (
    <UserContext.Provider
      value={{
        connectUser,
        disconnectUser,
        getEthers,
        getProvider,
        getSigner,
        getUser,
        getUserAddress,
        getAccessAllowed,
        getVerifying,
        getClient,
        getSetIsOptedIn,
        getIsOptedIn,
        getChekingOptIn,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserController = () => useContext(UserContext);

export default UserController;
