import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
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
  setTradeOfferId,
  setTradeModal,
  selectChainsItems,
  addTradeOffers,
  setTradeOffersTotal,
} from '../store';
import {
  getChainById,
  getErrorMessage,
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
} from '../services';
import {
  OfferType,
  TokenType,
  ChainType,
  OrderPlacingStatusType,
  ErrorMessageType,
} from '../types';
import { POOL_CONTRACT_ADDRESS } from '../config';
import { addGsheetRowRequest } from '../services/gsheetServices';

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
    filter: Tradefilter,
    chains: ChainType[],
    fromChainId: string,
    fromTokenId: string
  ) => void;
  handleTradeFilterChange: (name: TradeFilterFieldName, value: string) => void;
  handleFromAmountMaxClick: (balance: string) => void;
  handleEmailSubmitAction: (
    email: string,
    orderId: string,
    walletAddress: string
  ) => Promise<boolean>;
  handleSearchMoreOffersAction: () => void;
};

export const TradeContext = createContext<ContextProps>({
  handleAcceptOfferAction: () => {},
  handleSearchOffersAction: () => {},
  handleTradeFilterChange: () => {},
  handleFromAmountMaxClick: () => {},
  handleEmailSubmitAction: async () => false,
  handleSearchMoreOffersAction: () => {},
});

type TradeControllerProps = {
  children: React.ReactNode;
};

export const TradeController = ({ children }: TradeControllerProps) => {
  const accessToken = useAppSelector(selectUserAccessToken);
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectTradeFilter);
  const { toTokenId } = filter;
  const { getSigner, getEthers } = useUserController();
  const limit = 5;
  const [offset, setOffset] = useState(limit);
  const chains = useAppSelector(selectChainsItems);
  const fromChain = getChainById('5', chains);
  const fromToken = fromChain?.tokens?.find(
    (token: TokenType) => token.symbol === fromChain?.nativeToken
  );
  const fromChainId = fromChain?.chainId;
  const fromTokenId = fromToken?.coinmarketcapId;

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
    } catch (error) {}
    if (order) {
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

  const handleEmailSubmitAction = useCallback(
    async (
      email: string,
      orderId: string,
      walletAddress: string
    ): Promise<boolean> => {
      let res;
      try {
        res = await addGsheetRowRequest(accessToken, {
          email,
          walletAddress,
          orderId,
        });
      } catch (error: any) {
        console.error('handleEmailSubmitAction error:', error);
        return false;
      }
      return res;
    },
    [accessToken]
  );

  const validateSearchOffersAction = useCallback(
    (
      filter: Tradefilter,
      fromChainId: string,
      fromTokenId: string
    ): ErrorMessageType | true => {
      if (!fromChainId) {
        return {
          type: 'amount',
          text: 'Chain is required',
        };
      }
      if (!fromTokenId) {
        return {
          type: 'amount',
          text: 'Token is required',
        };
      }
      if (!filter.toChainId) {
        return {
          type: 'toChain',
          text: 'Chain is required',
        };
      }
      if (!filter.toTokenId) {
        return {
          type: 'toChain',
          text: 'Token is required',
        };
      }
      if (!filter.amount) {
        return {
          type: 'amount',
          text: 'Amount is required',
        };
      }
      if (!isNumeric(filter.amount)) {
        return {
          type: 'amount',
          text: 'Amount must be a number',
        };
      }
      if (parseFloat(filter.amount) <= 0) {
        return {
          type: 'amount',
          text: 'Amount must be greater than 0',
        };
      }
      return true;
    },
    []
  );

  const handleSearchOffersAction = useCallback(
    async (
      filter: Tradefilter,
      chains: ChainType[],
      fromChainId: string,
      fromTokenId: string
    ) => {
      dispatch(clearTradeError());
      const validation = validateSearchOffersAction(
        filter,
        fromChainId,
        fromTokenId
      );
      if (validation !== true) {
        dispatch(setTradeError(validation));
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
        limit: limit.toString(),
      };
      const queryString = new URLSearchParams(query).toString();
      const res = await searchOffersRequest(queryString).catch((error) => {
        dispatch(setTradeError({ type: 'search', text: error }));
      });
      if (typeof res?.items !== 'undefined') {
        dispatch(setTradeOffers(res.items));
      } else {
        dispatch(setTradeOffers([]));
        dispatch(setTradeOffersVisible(false));
      }
      dispatch(setTradeOffersTotal(res?.total || 0));
      dispatch(setTradeLoading(false));
      setOffset(limit);
    },
    [dispatch, validateSearchOffersAction]
  );

  const handleSearchMoreOffersAction = useCallback(async () => {
    dispatch(clearTradeError());
    const validation = validateSearchOffersAction(
      filter,
      fromChainId || '',
      fromTokenId || ''
    );
    if (validation !== true) {
      dispatch(setTradeError(validation));
      return;
    }
    dispatch(setTradeOffersVisible(true));
    const toToken = getTokenById(filter.toTokenId, filter.toChainId, chains);
    const query = {
      exchangeChainId: '5',
      exchangeToken: 'ETH',
      chainId: filter.toChainId,
      token: toToken?.symbol || '',
      depositAmount: filter.amount,
      limit: limit.toString(),
      offset: offset.toString(),
    };
    const queryString = new URLSearchParams(query).toString();
    const res = await searchOffersRequest(queryString);
    dispatch(addTradeOffers(res?.items || []));
    setOffset(offset + limit);
  }, [
    dispatch,
    validateSearchOffersAction,
    offset,
    filter,
    chains,
    fromChainId,
    fromTokenId,
  ]);

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
    dispatch(setTradeOfferId(''));
    dispatch(setTradeOrderTransactionId(''));
    dispatch(setTradeOrderStatus(OrderPlacingStatusType.UNINITIALIZED));
    dispatch(setTradeModal(true));

    const validation = validateAcceptOfferAction(offer, amount);
    if (!validation) {
      dispatch(setTradeError(validation));
      dispatch(setTradeOrderStatus(OrderPlacingStatusType.ERROR));
      return;
    }

    dispatch(setTradeOfferId(offer.offerId || ''));

    if (userChainId !== offer.exchangeChainId) {
      dispatch(
        setTradeOrderStatus(OrderPlacingStatusType.WAITING_NETWORK_SWITCH)
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
      dispatch(setTradeOfferId(''));
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
      dispatch(setTradeOfferId(''));
      dispatch(setTradeOrderStatus(OrderPlacingStatusType.ERROR));
      return;
    }

    dispatch(setTradeOrderStatus(OrderPlacingStatusType.WAITING_CONFIRMATION));

    // get signer
    const signer = getSigner();
    const ethers = getEthers();

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
    const gasEstimate = await poolContract.estimateGas
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
        }
      )
      .catch((error: any) => {
        console.log('gasEstimate error:', error);
      });

    // create transaction
    let tx;
    try {
      tx = await poolContract.depositETHAndAcceptOffer(
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
      );
    } catch (error: any) {
      dispatch(
        setTradeError({
          type: 'acceptOffer',
          text: getErrorMessage(error.error, 'Transaction rejected'),
        })
      );
      console.error('depositGRTWithOffer error', error);
      dispatch(setTradeOfferId(''));
      dispatch(setTradeOrderStatus(OrderPlacingStatusType.ERROR));
      return;
    }

    // save order to DB
    const order = await addOrderRequest(accessToken, {
      amountTokenDeposit: amountToPay,
      addressTokenDeposit: exchangeToken.address,
      chainIdTokenDeposit: offer.exchangeChainId,
      destAddr: userAddress,
      offerId: offer.offerId,
      orderId: '',
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
      dispatch(setTradeOfferId(''));
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
        dispatch(setTradeOfferId(''));
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
    dispatch(setTradeOfferId(''));
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
        handleEmailSubmitAction,
        handleSearchMoreOffersAction,
      }}
    >
      {children}
    </TradeContext.Provider>
  );
};

export const useTradeController = () => useContext(TradeContext);

export default TradeController;
