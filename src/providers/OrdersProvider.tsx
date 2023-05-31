import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { OrderType, ErrorMessageType } from '../types';
import {
  useAppDispatch,
  useAppSelector,
  ordersStoreActions,
  selectUserStore,
  selectWalletsStore,
  selectAbiStore,
  selectChainsStore,
} from '../store';
import {
  getMetaMaskErrorMessage,
  getOfferFromChain,
  switchMetamaskNetwork,
} from '../utils';
import { useUserProvider } from './UserProvider';
import {
  completeSellerOrderRequest,
  getOrderRequest,
  getSellerOrdersRequest,
  getWalletBalanceRequest,
  refreshSellerOrdersRequest,
} from '../services';

// Context props
type ContextProps = {
  handleOrderCompleteAction: (order: OrderType) => void;
  handleFetchMoreOrdersAction: () => void;
  handleOrdersRefreshAction: () => void;
};

export const OrdersContext = createContext<ContextProps>({
  handleOrderCompleteAction: () => {},
  handleFetchMoreOrdersAction: () => {},
  handleOrdersRefreshAction: () => {},
});

type OrdersProviderProps = {
  children: React.ReactNode;
};

export const OrdersProvider = ({ children }: OrdersProviderProps) => {
  const dispatch = useAppDispatch();
  const { accessToken, chainId: userChainId } = useAppSelector(selectUserStore);
  const { getSigner, getEthers } = useUserProvider();
  const limit = 5;
  const [offset, setOffset] = useState(limit);
  const { items: wallets } = useAppSelector(selectWalletsStore);
  const { liquidityWalletAbi } = useAppSelector(selectAbiStore);
  const { items: chains } = useAppSelector(selectChainsStore);

  const fetchOrders = useCallback(
    async (accessToken: string) => {
      dispatch(ordersStoreActions.setLoading(true));
      const res = await getSellerOrdersRequest(accessToken, limit, 0);
      dispatch(ordersStoreActions.setItems(res?.items || []));
      dispatch(ordersStoreActions.setTotal(res?.total || 0));
      dispatch(ordersStoreActions.setLoading(false));
    },
    [dispatch]
  );

  const fetchOrder = useCallback(
    async (_id: string) => {
      const res = await getOrderRequest(accessToken, _id);
      if (res) {
        dispatch(ordersStoreActions.updateItem(res));
      }
    },
    [accessToken, dispatch]
  );

  const handleFetchMoreOrdersAction = useCallback(async () => {
    const res = await getSellerOrdersRequest(accessToken, limit, offset);
    setOffset(offset + limit);
    dispatch(ordersStoreActions.addItems(res?.items || []));
  }, [dispatch, offset, accessToken]);

  const handleOrdersRefreshAction = useCallback(async () => {
    dispatch(ordersStoreActions.setRefreshing(true));
    const refreshedOrders = await refreshSellerOrdersRequest(accessToken).catch(
      (error: any) => {
        dispatch(ordersStoreActions.setRefreshing(false));
      }
    );
    if (refreshedOrders) {
      for (const order of refreshedOrders) {
        dispatch(ordersStoreActions.updateItem(order));
      }
    }
    dispatch(ordersStoreActions.setRefreshing(false));
  }, [accessToken, dispatch]);

  const validateOrderCompleteAction = (
    order: OrderType
  ): ErrorMessageType | true => {
    if (!order.offer) {
      return {
        type: order.orderId || '',
        text: 'Associated offer not found',
      };
    }
    if (!order.offerId) {
      return {
        type: order.orderId || '',
        text: 'Order has no associated offer id',
      };
    }
    return true;
  };

  const handleOrderCompleteAction = useCallback(
    async (order: OrderType) => {
      dispatch(ordersStoreActions.clearError());

      const validation = validateOrderCompleteAction(order);

      if (typeof validation !== 'boolean') {
        dispatch(ordersStoreActions.setError(validation));
        return false;
      }

      try {
        dispatch(ordersStoreActions.setCompleting(order.orderId));

        const userWalletAddress =
          wallets.find((w) => w.chainId === order.offer?.chainId || '')
            ?.walletAddress || '';

        if (!userWalletAddress) {
          throw new Error('Liquidity wallet not found');
        }

        const offerChainId = order.offer?.chainId || '';
        if (!order.offer) {
          throw new Error('Associated offer not found');
        }
        const offerFromChain = getOfferFromChain(order.offer, chains);
        if (!offerFromChain) {
          throw new Error('Offer chain not found');
        }
        const switchNetwork = await switchMetamaskNetwork(
          userChainId,
          offerFromChain
        );
        if (!switchNetwork) {
          throw new Error(
            'Network switching failed. Please, switch network in your MetaMask and try again.'
          );
        }

        let balance = await getWalletBalanceRequest(
          accessToken,
          offerChainId,
          '0x0',
          userWalletAddress
        );

        if (parseFloat(balance) < parseFloat(order.amountTokenOffer)) {
          console.error(
            "handleOrderCompleteClick error: You don't have enough BNB. Fund your liquidity wallet."
          );
          throw new Error(
            "You don't have enough BNB. Fund your liquidity wallet."
          );
        }

        // get signer
        const signer = getSigner();
        const ethers = getEthers();

        // set wallet contract
        const _walletContract = new ethers.Contract(
          userWalletAddress,
          liquidityWalletAbi,
          signer
        );

        // connect signer
        const walletContract = _walletContract.connect(signer);

        // pay order transaction
        const tx = await walletContract.payTradeWithNativeTokens(
          order.offerId,
          order.orderId,
          order.destAddr,
          ethers.utils.parseEther(parseFloat(order.amountTokenOffer).toFixed(6))
        );

        const completed = await completeSellerOrderRequest(
          accessToken,
          order.orderId,
          tx.hash || ''
        );

        if (!completed) {
          throw new Error("Server error: order wasn't marked as complete");
        }
        await fetchOrder(order._id);
      } catch (error: any) {
        dispatch(
          ordersStoreActions.setError({
            type: order.orderId || '',
            text: getMetaMaskErrorMessage(
              error,
              "Server error: order wasn't marked as complete"
            ),
          })
        );
      }
      dispatch(ordersStoreActions.setCompleting(''));
    },
    [
      accessToken,
      wallets,
      userChainId,
      liquidityWalletAbi,
      chains,
      dispatch,
      fetchOrder,
      getSigner,
      getEthers,
    ]
  );

  useEffect(() => {
    if (accessToken) {
      fetchOrders(accessToken);
    }
  }, [accessToken, fetchOrders]);

  return (
    <OrdersContext.Provider
      value={{
        handleOrderCompleteAction,
        handleFetchMoreOrdersAction,
        handleOrdersRefreshAction,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrdersProvider = () => useContext(OrdersContext);

export default OrdersProvider;
