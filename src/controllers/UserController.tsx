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

// Context props
type ContextProps = {
  connectUser: () => void;
  disconnectUser: () => void;
  getEthers: () => any;
  getProvider: () => any;
  getSigner: () => any;
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

  const getSigner = () => {
    const provider = getProvider();
    return provider.getSigner();
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
  }, [user, dispatch]);

  useEffect(() => {
    dispatch(setUserAddress(address || ''));
  }, [address, dispatch]);

  useEffect(() => {
    dispatch(
      setUserChain(
        chain ? (typeof chain === 'number' ? chain.toString() : chain) : ''
      )
    );
  }, [chain, dispatch]);

  useEffect(() => {
    dispatch(setUserAccessToken(token?.access_token || ''));
  }, [token?.access_token, dispatch]);

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
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserController = () => useContext(UserContext);

export default UserController;
