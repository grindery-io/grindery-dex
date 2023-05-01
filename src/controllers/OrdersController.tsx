import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import { OrderType, ChainType } from '../types';
import {
  useAppDispatch,
  useAppSelector,
  clearOrdersError,
  setOrdersError,
  setOrdersItems,
  setOrdersLoading,
  selectUserAccessToken,
} from '../store';
import {
  getErrorMessage,
  getOfferFromChain,
  switchMetamaskNetwork,
} from '../utils';
import { useUserController } from './UserController';
import {
  completeSellerOrderRequest,
  getSellerOrdersRequest,
  getWalletBalanceRequest,
  updateWalletRequest,
} from '../services';

// Context props
type ContextProps = {
  handleOrderCompleteAction: (
    order: OrderType,
    accessToken: string,
    userWalletAddress: string,
    userChainId: string,
    liquidityWalletAbi: any,
    orders: OrderType[],
    chains: ChainType[]
  ) => Promise<boolean>;
};

export const OrdersContext = createContext<ContextProps>({
  handleOrderCompleteAction: async () => false,
});

type OrdersControllerProps = {
  children: React.ReactNode;
};

export const OrdersController = ({ children }: OrdersControllerProps) => {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector(selectUserAccessToken);
  const { getSigner, getEthers } = useUserController();

  const fetchOrders = useCallback(
    async (accessToken: string) => {
      dispatch(setOrdersLoading(true));
      const orders = await getSellerOrdersRequest(accessToken);
      dispatch(setOrdersItems(orders || []));
      dispatch(setOrdersLoading(false));
    },
    [dispatch]
  );

  const validateOrderCompleteAction = (order: OrderType): boolean => {
    if (!order.offer) {
      dispatch(
        setOrdersError({
          type: order.orderId || '',
          text: 'Associated offer not found',
        })
      );
      return false;
    }
    if (!order.offer) {
      return false;
    }
    if (!order.offerId) {
      dispatch(
        setOrdersError({
          type: order.orderId || '',
          text: 'Order has no associated offer id',
        })
      );
      return false;
    }

    return true;
  };

  const handleOrderCompleteAction = async (
    order: OrderType,
    accessToken: string,
    userWalletAddress: string,
    userChainId: string,
    liquidityWalletAbi: any,
    orders: OrderType[],
    chains: ChainType[]
  ): Promise<boolean> => {
    dispatch(clearOrdersError());

    if (!validateOrderCompleteAction(order)) {
      return false;
    }

    if (!userWalletAddress) {
      dispatch(
        setOrdersError({
          type: order.orderId || '',
          text: 'Liquidity wallet not found',
        })
      );
      return false;
    }

    const offerChainId = order.offer?.chainId || '';
    const offerTokenSymbol = order.offer?.token || '';
    if (!order.offer) {
      dispatch(
        setOrdersError({
          type: order.orderId,
          text: 'Associated offer not found',
        })
      );
      return false;
    }
    const offerFromChain = getOfferFromChain(order.offer, chains);
    if (!offerFromChain) {
      dispatch(
        setOrdersError({
          type: order.orderId,
          text: 'Offer chain not found',
        })
      );
      return false;
    }
    const switchNetwork = await switchMetamaskNetwork(
      userChainId,
      offerFromChain
    );
    if (!switchNetwork) {
      dispatch(
        setOrdersError({
          type: order.orderId,
          text: 'Network switching failed. Please, switch network in your MetaMask and try again.',
        })
      );
      return false;
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
      dispatch(
        setOrdersError({
          type: order.orderId,
          text: "You don't have enough BNB. Fund your liquidity wallet.",
        })
      );
      return false;
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
    const tx = await walletContract
      .payOfferWithNativeTokens(
        order.offerId,
        order.destAddr,
        ethers.utils.parseEther(parseFloat(order.amountTokenOffer).toFixed(6))
      )
      .catch((error: any) => {
        console.error('payOfferWithNativeTokens error', error);
        dispatch(
          setOrdersError({
            type: order.orderId || '',
            text: getErrorMessage(error) || 'Transaction error',
          })
        );
        return false;
      });

    // stop execution if order payment failed
    if (!tx) {
      dispatch(
        setOrdersError({
          type: order.orderId || '',
          text: 'Transaction error',
        })
      );
      return false;
    }

    // wait for payment transaction
    try {
      await tx.wait();
    } catch (error: any) {
      console.error('tx.wait error', error);
      dispatch(
        setOrdersError({
          type: order.orderId || '',
          text: getErrorMessage(error) || 'Transaction error',
        })
      );
      return false;
    }

    // get liquidity wallet balance
    balance = await getWalletBalanceRequest(
      accessToken,
      offerChainId,
      '0x0',
      userWalletAddress
    );

    // update wallet balance
    const isUpdated = await updateWalletRequest(accessToken, {
      walletAddress: userWalletAddress,
      chainId: offerChainId,
      tokenId: offerTokenSymbol,
      amount: balance.toString(),
    });

    if (!isUpdated) {
      console.error(
        "handleOrderCompleteClick error: wallet balance wasn't updated"
      );
      dispatch(
        setOrdersError({
          type: order.orderId || '',
          text: "Server error: wallet balance wasn't updated",
        })
      );
      return false;
    }

    // set order as completed
    const completed = await completeSellerOrderRequest(
      accessToken,
      order.orderId
    );

    if (!completed) {
      console.error(
        "handleOrderCompleteClick error: order wasn't marked as completed"
      );
      dispatch(
        setOrdersError({
          type: order.orderId || '',
          text: "Server error: order wasn't marked as complete",
        })
      );
      return false;
    }
    dispatch(
      setOrdersItems([
        ...orders.map((o: OrderType) => {
          if (o.orderId === order.orderId) {
            return {
              ...o,
              isComplete: true,
            };
          } else {
            return o;
          }
        }),
      ])
    );
    return true;
  };

  useEffect(() => {
    if (accessToken) {
      fetchOrders(accessToken);
    }
  }, [accessToken, fetchOrders]);

  return (
    <OrdersContext.Provider
      value={{
        handleOrderCompleteAction,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrdersController = () => useContext(OrdersContext);

export default OrdersController;
