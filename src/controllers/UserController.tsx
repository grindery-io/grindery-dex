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
  setUserAdvancedMode,
  setUserPopupClosed,
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
  handleAdvancedModeToggleAction: (userId: string, newMode: boolean) => void;
  handlePopupCloseAction: () => void;
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
  handleAdvancedModeToggleAction: () => {},
  handlePopupCloseAction: () => {},
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
    async (accessToken: string) => {
      dispatch(setUserChainTokenPriceLoading(true));
      const price = await getTokenPriceById(accessToken, 'ETH');
      dispatch(setUserChainTokenPrice(price));
      dispatch(setUserChainTokenPriceLoading(false));
    },
    [dispatch]
  );

  const fetchChainTokenBalance = useCallback(
    async (accessToken: string, address: string) => {
      dispatch(setUserChainTokenBalanceLoading(true));
      const balance = await getTokenBalanceRequest(
        accessToken,
        '5',
        address,
        '0x0'
      );
      dispatch(setUserChainTokenBalance(balance || '0'));
      dispatch(setUserChainTokenBalanceLoading(false));
    },
    [dispatch]
  );

  const handleAdvancedModeToggleAction = (userId: string, newMode: boolean) => {
    dispatch(setUserAdvancedMode(newMode));
    localStorage.setItem(`${userId}_advancedMode`, newMode.toString());
  };

  const handlePopupCloseAction = () => {
    dispatch(setUserPopupClosed(true));
    localStorage.setItem(
      `mercari_popup_closed`,
      JSON.stringify({
        value: 'true',
        expires: new Date().getTime() + 86400000,
      })
    );
  };

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
    if (userAccessToken) {
      checkUserIsAdmin(userAccessToken);
    }
  }, [userAccessToken, checkUserIsAdmin]);

  useEffect(() => {
    if (userChainId && userAccessToken && userAddress && userChainTokenSymbol) {
      fetchChainTokenBalance(userAccessToken, userAddress);
      fetchChainTokenPrice(userAccessToken);
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

  useEffect(() => {
    const savedAdvancedMode = localStorage.getItem(`${user}_advancedMode`);
    dispatch(setUserAdvancedMode(savedAdvancedMode === 'true'));
  }, [user, dispatch]);

  useEffect(() => {
    const popupClosed = localStorage.getItem(`mercari_popup_closed`);
    if (popupClosed) {
      const popupClosedJson = JSON.parse(popupClosed);
      const value = popupClosedJson.value;
      const expires = popupClosedJson.expires;
      if (value === 'true' && expires && new Date().getTime() < expires) {
        dispatch(setUserPopupClosed(true));
      } else {
        localStorage.removeItem('mercari_popup_closed');
      }
    }
  }, [dispatch]);

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
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserController = () => useContext(UserContext);

export default UserController;
