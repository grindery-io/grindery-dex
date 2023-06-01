import React, {
  createContext,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import { useGrinderyNexus } from 'use-grindery-nexus';
import {
  useAppDispatch,
  useAppSelector,
  selectChainsStore,
  selectUserStore,
  userStoreActions,
} from '../store';
import {
  getTokenBalanceRequest,
  getTokenPriceById,
  isUserAdmin,
} from '../services';
import { getChainById } from '../utils';
import { TokenType } from '../types';

// Context props
type ContextProps = {
  connectUser: () => void;
  disconnectUser: () => void;
  getEthers: () => any;
  getProvider: () => any;
  getSigner: () => any;
  handleAdvancedModeToggleAction: (userId: string, newMode: boolean) => void;
  handlePopupCloseAction: () => void;
  getTokenPriceBySymbol: (tokenSymbol: string) => Promise<number>;
};

// Context provider props
type UserProviderProps = {
  children: React.ReactNode;
};

// Init context
export const UserContext = createContext<ContextProps>({
  connectUser: () => {},
  disconnectUser: () => {},
  getEthers: () => {},
  getProvider: () => {},
  getSigner: () => {},
  handleAdvancedModeToggleAction: () => {},
  handlePopupCloseAction: () => {},
  getTokenPriceBySymbol: async () => 0,
});

export const UserProvider = ({ children }: UserProviderProps) => {
  const { user, address, chain, connect, disconnect, ethers, provider, token } =
    useGrinderyNexus();
  const dispatch = useAppDispatch();
  const {
    accessToken,
    chainId: userChainId,
    address: userAddress,
  } = useAppSelector(selectUserStore);
  const { items: chains } = useAppSelector(selectChainsStore);
  const userChain = getChainById(userChainId, chains);

  const connectUser = () => {
    connect();
  };

  const disconnectUser = useCallback(() => {
    disconnect();
  }, [disconnect]);

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
      dispatch(userStoreActions.setIsAdminLoading(true));
      const res = await isUserAdmin(accessToken);
      dispatch(userStoreActions.setIsAdmin(res));
      dispatch(userStoreActions.setIsAdminLoading(false));
    },
    [dispatch]
  );

  const getTokenPriceBySymbol = useCallback(
    async (tokenSymbol: string) => {
      const price = await getTokenPriceById(accessToken, tokenSymbol);
      return price;
    },
    [accessToken]
  );

  const handleAdvancedModeToggleAction = (userId: string, newMode: boolean) => {
    dispatch(userStoreActions.setAdvancedMode(newMode));
    localStorage.setItem(`${userId}_advancedMode`, newMode.toString());
  };

  const handlePopupCloseAction = () => {
    dispatch(userStoreActions.setPopupClosed(true));
    localStorage.setItem(
      `mercari_popup_closed`,
      JSON.stringify({
        value: 'true',
        expires: new Date().getTime() + 86400000,
      })
    );
  };

  const getUserTokens = useCallback(async () => {
    dispatch(userStoreActions.setUserTokens([]));
    if (accessToken && userChain && userChain?.tokens && userAddress) {
      const promises = userChain?.tokens.map(async (token: TokenType) => {
        const price = await getTokenPriceById(accessToken, token.symbol).catch(
          () => {
            return 0;
          }
        );
        const balance = await getTokenBalanceRequest(
          accessToken,
          userChain.chainId,
          userAddress,
          token.address || ''
        ).catch(() => {
          return '0';
        });
        return { token, price, balance };
      });

      const results = await Promise.all(promises);
      dispatch(userStoreActions.setUserTokens(results));
    }
  }, [accessToken, userAddress, userChain, dispatch]);

  useEffect(() => {
    getUserTokens();
  }, [getUserTokens]);

  useEffect(() => {
    dispatch(userStoreActions.setId(user || ''));
  }, [user, dispatch]);

  useEffect(() => {
    dispatch(userStoreActions.setAddress(address || ''));
  }, [address, dispatch]);

  useEffect(() => {
    dispatch(
      userStoreActions.setChain(
        chain ? (typeof chain === 'number' ? chain.toString() : chain) : ''
      )
    );
  }, [chain, dispatch]);

  useEffect(() => {
    dispatch(userStoreActions.setAccessToken(token?.access_token || ''));
  }, [token?.access_token, dispatch]);

  useEffect(() => {
    if (accessToken) {
      checkUserIsAdmin(accessToken);
    }
  }, [accessToken, checkUserIsAdmin]);

  useEffect(() => {
    const savedAdvancedMode = localStorage.getItem(`${user}_advancedMode`);
    dispatch(userStoreActions.setAdvancedMode(savedAdvancedMode === 'true'));
  }, [user, dispatch]);

  useEffect(() => {
    const popupClosed = localStorage.getItem(`mercari_popup_closed`);
    if (popupClosed) {
      const popupClosedJson = JSON.parse(popupClosed);
      const value = popupClosedJson.value;
      const expires = popupClosedJson.expires;
      if (value === 'true' && expires && new Date().getTime() < expires) {
        dispatch(userStoreActions.setPopupClosed(true));
      } else {
        localStorage.removeItem('mercari_popup_closed');
      }
    }
  }, [dispatch]);

  useEffect(() => {
    const timeout = (token?.expires_in || 3600) * 1000;
    const timer = setTimeout(() => {
      if (token?.expires_in && typeof token?.expires_in === 'number') {
        disconnectUser();
        dispatch(userStoreActions.setSessionExpired(true));
      }
    }, timeout);

    return () => clearTimeout(timer);
  }, [token?.expires_in, disconnectUser, dispatch]);

  return (
    <UserContext.Provider
      value={{
        connectUser,
        disconnectUser,
        getEthers,
        getProvider,
        getSigner,
        handleAdvancedModeToggleAction,
        handlePopupCloseAction,
        getTokenPriceBySymbol,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserProvider = () => useContext(UserContext);

export default UserProvider;
