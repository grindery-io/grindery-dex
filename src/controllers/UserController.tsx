import React, {
  createContext,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import { useGrinderyNexus } from 'use-grindery-nexus';
import {
  useAppDispatch,
  setUserAccessToken,
  setUserAddress,
  setUserChain,
  setUserId,
  setUserIsAdmin,
  setUserIsAdminLoading,
  setUserChainTokenPriceLoading,
  setUserChainTokenPrice,
  setUserChainTokenBalance,
  useAppSelector,
  selectUserChainId,
  selectUserAccessToken,
  selectUserAddress,
  selectChainsItems,
  setUserChainTokenBalanceLoading,
} from '../store';
import {
  getTokenBalanceRequest,
  getTokenPriceById,
  isUserAdmin,
} from '../services';
import { getChainById } from '../utils';

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
  const userChainId = useAppSelector(selectUserChainId);
  const userAccessToken = useAppSelector(selectUserAccessToken);
  const userAddress = useAppSelector(selectUserAddress);
  const chains = useAppSelector(selectChainsItems);
  const userChainTokenSymbol =
    getChainById(userChainId, chains)?.nativeToken || '';

  const dispatch = useAppDispatch();

  const connectUser = () => {
    connect();
  };

  const disconnectUser = () => {
    disconnect();
    dispatch(setUserId(''));
    dispatch(setUserAddress(''));
    dispatch(setUserAccessToken(''));
    window.location.href = '/';
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

  const fetchChainTokenPrice = useCallback(
    async (accessToken: string, tokenSymbol: string) => {
      dispatch(setUserChainTokenPriceLoading(true));
      const price = await getTokenPriceById(accessToken, tokenSymbol);
      dispatch(setUserChainTokenPrice(price));
      dispatch(setUserChainTokenPriceLoading(false));
    },
    [dispatch]
  );

  const fetchChainTokenBalance = useCallback(
    async (
      accessToken: string,
      chainId: string,
      address: string,
      tokenAddress: string
    ) => {
      dispatch(setUserChainTokenBalanceLoading(true));
      const balance = await getTokenBalanceRequest(
        accessToken,
        chainId,
        address,
        tokenAddress
      );
      dispatch(setUserChainTokenBalance(balance || '0'));
      dispatch(setUserChainTokenBalanceLoading(false));
    },
    [dispatch]
  );

  useEffect(() => {
    if (user) {
      dispatch(setUserId(user));
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (address) {
      dispatch(setUserAddress(address));
    }
  }, [address, dispatch]);

  useEffect(() => {
    dispatch(
      setUserChain(
        chain ? (typeof chain === 'number' ? chain.toString() : chain) : ''
      )
    );
  }, [chain, dispatch]);

  useEffect(() => {
    if (token?.access_token) {
      dispatch(setUserAccessToken(token?.access_token || ''));
    }
  }, [token?.access_token, dispatch]);

  useEffect(() => {
    if (token?.access_token) {
      checkUserIsAdmin(token?.access_token);
    }
  }, [token?.access_token, checkUserIsAdmin]);

  useEffect(() => {
    if (userChainId && userAccessToken && userAddress && userChainTokenSymbol) {
      fetchChainTokenBalance(userAccessToken, userChainId, userAddress, '0x0');
      fetchChainTokenPrice(userAccessToken, userChainTokenSymbol);
    } else {
      dispatch(setUserChainTokenBalance('0'));
      dispatch(setUserChainTokenPrice(null));
      dispatch(setUserChainTokenPriceLoading(false));
    }
  }, [
    userChainId,
    userAccessToken,
    userAddress,
    userChainTokenSymbol,
    fetchChainTokenBalance,
    fetchChainTokenPrice,
    dispatch,
  ]);

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
