import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import {
  useAppDispatch,
  useAppSelector,
  selectUserAccessToken,
  TradeFilterFieldName,
  Tradefilter,
  clearTradeError,
  selectTradeFilter,
  setTradeError,
  setTradeFilterValue,
  setTradeLoading,
  setTradeOffers,
  setTradeOffersVisible,
  setTradePricesLoading,
  setTradeToTokenPrice,
  setOrdersItems,
  setTradeOrderStatus,
  setTradeOrderTransactionId,
} from '../store';
import {
  getChainById,
  getErrorMessage,
  getOrderIdFromReceipt,
  getTokenById,
  isNumeric,
  switchMetamaskNetwork,
} from '../utils';
import { useUserController } from './UserController';
import {
  searchOffersRequest,
  getTokenPriceById,
  addOrderRequest,
  getOrderRequest,
  getOfferById,
} from '../services';
import {
  OfferType,
  TokenType,
  ChainType,
  OrderPlacingStatusType,
  ErrorMessageType,
} from '../types';
import { POOL_CONTRACT_ADDRESS } from '../config';

// Context props
type ContextProps = {
  handleAcceptOfferAction: (
    offer: OfferType,
    accessToken: string,
    userChainId: string,
    exchangeToken: TokenType,
    poolAbi: any,
    userAddress: string,
    amount: string,
    chains: ChainType[]
  ) => void;
  handleSearchOffersAction: (
    accessToken: string,
    filter: Tradefilter,
    chains: ChainType[],
    fromTokenBalance: string,
    fromChainId: string,
    fromTokenId: string
  ) => void;
  handleTradeFilterChange: (name: TradeFilterFieldName, value: string) => void;
  handleFromAmountMaxClick: (balance: string) => void;
};

export const TradeContext = createContext<ContextProps>({
  handleAcceptOfferAction: () => {},
  handleSearchOffersAction: () => {},
  handleTradeFilterChange: () => {},
  handleFromAmountMaxClick: () => {},
});

type TradeControllerProps = {
  children: React.ReactNode;
};

export const TradeController = ({ children }: TradeControllerProps) => {
  const accessToken = useAppSelector(selectUserAccessToken);
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectTradeFilter);
  const { toTokenId } = filter;
  const { getSigner, getEthers, getProvider } = useUserController();

  const fetchTokenPrice = useCallback(
    async (accessToken: string, toTokenId: string) => {
      dispatch(setTradePricesLoading(true));
      const toPrice = await getTokenPriceById(accessToken, toTokenId);
      dispatch(setTradeToTokenPrice(toPrice));
      dispatch(setTradePricesLoading(false));
    },
    [dispatch]
  );

  const fetchSingleOrder = async (accessToken: string, id: string) => {
    let order;
    try {
      order = await getOrderRequest(accessToken, id);
    } catch (error) {
      // handle order fetching error
    }
    if (order) {
      const offer = await getOfferById(accessToken, order.offerId || '').catch(
        () => {
          // handle offer fetching error
        }
      );
      if (offer) {
        order.offer = offer;
      }
      dispatch(setOrdersItems([order]));
    }
  };

  const handleTradeFilterChange = (
    name: TradeFilterFieldName,
    value: string
  ) => {
    dispatch(clearTradeError());
    dispatch(setTradeOffersVisible(false));
    dispatch(setTradeFilterValue({ name, value }));
  };

  const handleFromAmountMaxClick = (balance: string) => {
    dispatch(clearTradeError());
    dispatch(setTradeOffersVisible(false));
    dispatch(setTradeFilterValue({ name: 'amount', value: balance }));
  };

  const validateSearchOffersAction = useCallback(
    (
      filter: Tradefilter,
      fromTokenBalance: string,
      fromChainId: string,
      fromTokenId: string
    ): boolean => {
      if (!fromChainId) {
        dispatch(
          setTradeError({
            type: 'amount',
            text: 'Chain is required',
          })
        );

        return false;
      }
      if (!fromTokenId) {
        dispatch(
          setTradeError({
            type: 'amount',
            text: 'Token is required',
          })
        );

        return false;
      }
      if (!filter.toChainId) {
        dispatch(
          setTradeError({
            type: 'toChain',
            text: 'Chain is required',
          })
        );

        return false;
      }
      if (!filter.toTokenId) {
        dispatch(
          setTradeError({
            type: 'toChain',
            text: 'Token is required',
          })
        );

        return false;
      }
      if (!filter.amount) {
        dispatch(
          setTradeError({
            type: 'amount',
            text: 'Amount is required',
          })
        );

        return false;
      }
      if (!isNumeric(filter.amount)) {
        dispatch(
          setTradeError({
            type: 'amount',
            text: 'Amount must be a number',
          })
        );

        return false;
      }
      if (parseFloat(filter.amount) <= 0) {
        dispatch(
          setTradeError({
            type: 'amount',
            text: 'Amount must be greater than 0',
          })
        );

        return false;
      }
      if (parseFloat(filter.amount) > parseFloat(fromTokenBalance)) {
        dispatch(
          setTradeError({
            type: 'search',
            text: "You don't have enough funds",
          })
        );
        dispatch(setTradeOffersVisible(false));
        return false;
      }
      return true;
    },
    [dispatch]
  );

  const handleSearchOffersAction = useCallback(
    async (
      accessToken: string,
      filter: Tradefilter,
      chains: ChainType[],
      fromTokenBalance: string,
      fromChainId: string,
      fromTokenId: string
    ) => {
      dispatch(clearTradeError());
      if (
        !validateSearchOffersAction(
          filter,
          fromTokenBalance,
          fromChainId,
          fromTokenId
        )
      ) {
        return;
      }
      dispatch(setTradeLoading(true));
      dispatch(setTradeOffersVisible(true));
      const toToken = getTokenById(filter.toTokenId, filter.toChainId, chains);
      const query = {
        exchangeChainId: '5',
        exchangeToken: 'ETH',
        chainId: filter.toChainId,
        token: toToken?.symbol || '',
        depositAmount: filter.amount,
      };
      const queryString = new URLSearchParams(query).toString();
      const items = await searchOffersRequest(accessToken, queryString).catch(
        (error) => {
          dispatch(setTradeError({ type: 'search', text: error }));
        }
      );
      if (typeof items !== 'undefined') {
        dispatch(setTradeOffers(items));
      } else {
        dispatch(setTradeOffers([]));
        dispatch(setTradeOffersVisible(false));
      }
      dispatch(setTradeLoading(false));
    },
    [dispatch, validateSearchOffersAction]
  );

  const validateAcceptOfferAction = (
    offer: OfferType,
    amount: string
  ): ErrorMessageType | true => {
    if (!offer.offerId) {
      return {
        type: 'acceptOffer',
        text: 'offer id is missing',
      };
    }

    if (!amount) {
      return {
        type: 'acceptOffer',
        text: 'Tokens amount is missing',
      };
    }

    if (!offer.exchangeRate) {
      return {
        type: 'acceptOffer',
        text: 'Exchange rate is missing',
      };
    }

    if (!offer.exchangeChainId) {
      return {
        type: 'acceptOffer',
        text: 'Offer exchange chain is not set',
      };
    }

    return true;
  };

  const handleAcceptOfferAction = async (
    offer: OfferType,
    accessToken: string,
    userChainId: string,
    exchangeToken: TokenType,
    poolAbi: any,
    userAddress: string,
    amount: string,
    chains: ChainType[]
  ) => {
    dispatch(clearTradeError());
    dispatch(setTradeOrderStatus(OrderPlacingStatusType.UNINITIALIZED));
    const validation = validateAcceptOfferAction(offer, amount);
    if (!validation) {
      dispatch(setTradeError(validation));
      dispatch(setTradeOrderStatus(OrderPlacingStatusType.ERROR));
      return;
    }

    if (userChainId !== offer.exchangeChainId) {
      dispatch(
        setTradeOrderStatus(OrderPlacingStatusType.WAITING_NETOWORK_SWITCH)
      );
    }

    const inputChain = getChainById(offer.exchangeChainId || '', chains);
    if (!inputChain) {
      dispatch(
        setTradeError({
          type: 'acceptOffer',
          text: 'Chain not found',
        })
      );
      dispatch(setTradeOrderStatus(OrderPlacingStatusType.ERROR));
      return;
    }
    const networkSwitched = await switchMetamaskNetwork(
      userChainId,
      inputChain
    );
    if (!networkSwitched) {
      dispatch(
        setTradeError({
          type: 'acceptOffer',
          text: 'Network switching failed. Please, switch network in your MetaMask and try again.',
        })
      );
      dispatch(setTradeOrderStatus(OrderPlacingStatusType.ERROR));
      return;
    }

    dispatch(setTradeOrderStatus(OrderPlacingStatusType.WAITING_CONFIRMATION));

    // get signer
    const signer = getSigner();
    const ethers = getEthers();
    const provider = getProvider();

    const amountToPay = amount;

    // set pool contract
    const _poolContract = new ethers.Contract(
      POOL_CONTRACT_ADDRESS[`eip155:${offer.exchangeChainId}`],
      poolAbi,
      signer
    );

    // connect signer
    const poolContract = _poolContract.connect(signer);

    // get gas estimation
    const gasEstimate = await poolContract.estimateGas.depositETHAndAcceptOffer(
      offer.offerId,
      userAddress,
      ethers.utils.parseEther(
        parseFloat(offer.amount || '0')
          .toFixed(18)
          .toString()
      ),
      {
        value: ethers.utils.parseEther(amountToPay),
      }
    );

    // create transaction
    const tx = await poolContract
      .depositETHAndAcceptOffer(
        offer.offerId,
        userAddress,
        ethers.utils.parseEther(
          parseFloat(offer.amount || '0')
            .toFixed(18)
            .toString()
        ),
        {
          value: ethers.utils.parseEther(amountToPay),
          gasLimit: gasEstimate,
        }
      )
      .catch((error: any) => {
        dispatch(
          setTradeError({
            type: 'acceptOffer',
            text: getErrorMessage(error.error, 'Transaction rejected'),
          })
        );
        console.error('depositGRTWithOffer error', error);
        dispatch(setTradeOrderStatus(OrderPlacingStatusType.ERROR));
        return;
      });

    // stop execution if offer activation failed
    if (!tx) {
      dispatch(setTradeOrderStatus(OrderPlacingStatusType.ERROR));
      return;
    }

    dispatch(setTradeOrderStatus(OrderPlacingStatusType.PROCESSING));

    // wait for activation transaction
    try {
      await tx.wait();
    } catch (error: any) {
      dispatch(
        setTradeError({
          type: 'acceptOffer',
          text: error?.message || 'Transaction error',
        })
      );
      console.error('tx.wait error', error);
      dispatch(setTradeOrderStatus(OrderPlacingStatusType.ERROR));
      return;
    }

    // get receipt
    const receipt = await provider.getTransactionReceipt(tx.hash);

    // get orderId
    const orderId = getOrderIdFromReceipt(receipt);

    // save order to DB
    const order = await addOrderRequest(accessToken, {
      amountTokenDeposit: amountToPay,
      addressTokenDeposit: exchangeToken.address,
      chainIdTokenDeposit: offer.exchangeChainId,
      destAddr: userAddress,
      offerId: offer.offerId,
      orderId,
      amountTokenOffer: (
        parseFloat(amount) / parseFloat(offer.exchangeRate || '1')
      ).toString(),
      hash: tx.hash || '',
    }).catch((error: any) => {
      console.error('saveOrder error', error);
      dispatch(
        setTradeError({
          type: 'acceptOffer',
          text: error?.message || 'Server error',
        })
      );
      dispatch(setTradeOrderStatus(OrderPlacingStatusType.ERROR));
    });
    if (order) {
      try {
        fetchSingleOrder(accessToken, order);
      } catch (error: any) {
        console.error('saveOrder error', error);
        dispatch(
          setTradeError({
            type: 'acceptOffer',
            text: error?.message || "Server error, order wasn't found",
          })
        );
        dispatch(setTradeOrderStatus(OrderPlacingStatusType.ERROR));
        return;
      }

      dispatch(setTradeOrderTransactionId(tx.hash || ''));
      dispatch(setTradeOrderStatus(OrderPlacingStatusType.COMPLETED));
    } else {
      dispatch(
        setTradeError({
          type: 'acceptOffer',
          text: "Server error, order wasn't saved",
        })
      );
      dispatch(setTradeOrderStatus(OrderPlacingStatusType.ERROR));
    }
  };

  useEffect(() => {
    if (accessToken && toTokenId) {
      fetchTokenPrice(accessToken, toTokenId);
    }
  }, [accessToken, fetchTokenPrice, toTokenId]);

  return (
    <TradeContext.Provider
      value={{
        handleAcceptOfferAction,
        handleSearchOffersAction,
        handleTradeFilterChange,
        handleFromAmountMaxClick,
      }}
    >
      {children}
    </TradeContext.Provider>
  );
};

export const useTradeController = () => useContext(TradeContext);

export default TradeController;
