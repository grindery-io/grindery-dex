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
  TradeFilterFieldName,
  Tradefilter,
  ordersStoreActions,
  selectAbiStore,
  selectChainsStore,
  selectTradeStore,
  tradeStoreActions,
  selectUserStore,
} from '../store';
import {
  getChainById,
  getMetaMaskErrorMessage,
  getTokenById,
  getTokenBySymbol,
  isNumeric,
  switchMetamaskNetwork,
} from '../utils';
import { useUserProvider } from './UserProvider';
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
import { addGsheetRowRequest } from '../services/gsheetServices';

// Context props
type ContextProps = {
  handleAcceptOfferAction: (offer: OfferType) => void;
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

type TradeProviderProps = {
  children: React.ReactNode;
};

export const TradeProvider = ({ children }: TradeProviderProps) => {
  const dispatch = useAppDispatch();
  const {
    accessToken,
    chainId: userChainId,
    address: userAddress,
  } = useAppSelector(selectUserStore);
  const { filter } = useAppSelector(selectTradeStore);
  const { toTokenId, amount, fromChainId } = filter;
  const { getSigner, getEthers } = useUserProvider();
  const limit = 5;
  const [offset, setOffset] = useState(limit);
  const { items: chains } = useAppSelector(selectChainsStore);
  const fromChain = getChainById(fromChainId, chains);
  const fromToken = fromChain?.tokens?.find(
    (token: TokenType) => token.symbol === fromChain?.nativeToken
  );
  const fromTokenId = fromToken?.coinmarketcapId;
  const { poolAbi } = useAppSelector(selectAbiStore);

  const fetchTokenPrice = useCallback(
    async (toTokenId: string) => {
      dispatch(tradeStoreActions.setPricesLoading(true));
      const toPrice = await getTokenPriceById(accessToken, toTokenId);
      dispatch(tradeStoreActions.setToTokenPrice(toPrice));
      dispatch(tradeStoreActions.setPricesLoading(false));
    },
    [accessToken, dispatch]
  );

  const fetchSingleOrder = useCallback(
    async (id: string) => {
      let order;
      try {
        order = await getOrderRequest(accessToken, id);
      } catch (error) {}
      if (order) {
        dispatch(ordersStoreActions.setItems([order]));
      }
    },
    [accessToken, dispatch]
  );

  const handleTradeFilterChange = (
    name: TradeFilterFieldName,
    value: string
  ) => {
    dispatch(tradeStoreActions.clearError());
    dispatch(tradeStoreActions.setOffersVisible(false));
    dispatch(tradeStoreActions.setFilterValue({ name, value }));
  };

  const handleFromAmountMaxClick = (balance: string) => {
    dispatch(tradeStoreActions.clearError());
    dispatch(tradeStoreActions.setOffersVisible(false));
    dispatch(
      tradeStoreActions.setFilterValue({ name: 'amount', value: balance })
    );
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
          type: 'fromChain',
          text: 'Chain is required',
        };
      }
      if (!fromTokenId) {
        return {
          type: 'fromChain',
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
      dispatch(tradeStoreActions.clearError());
      const validation = validateSearchOffersAction(
        filter,
        fromChainId,
        fromTokenId
      );
      if (validation !== true) {
        dispatch(tradeStoreActions.setError(validation));
        return;
      }
      dispatch(tradeStoreActions.setLoading(true));
      dispatch(tradeStoreActions.setOffersVisible(true));
      const toToken = getTokenById(filter.toTokenId, filter.toChainId, chains);
      const fromToken = getTokenById(fromTokenId, fromChainId, chains);
      const query = {
        exchangeChainId: fromChainId,
        exchangeToken: fromToken?.symbol || '',
        chainId: filter.toChainId,
        token: toToken?.symbol || '',
        depositAmount: filter.amount,
        limit: limit.toString(),
      };
      const queryString = new URLSearchParams(query).toString();
      const res = await searchOffersRequest(queryString).catch((error) => {
        dispatch(tradeStoreActions.setError({ type: 'search', text: error }));
      });
      if (typeof res?.items !== 'undefined') {
        dispatch(tradeStoreActions.setOffers(res.items));
      } else {
        dispatch(tradeStoreActions.setOffers([]));
        dispatch(tradeStoreActions.setOffersVisible(false));
      }
      dispatch(tradeStoreActions.setOffersTotal(res?.total || 0));
      dispatch(tradeStoreActions.setLoading(false));
      setOffset(limit);
    },
    [dispatch, validateSearchOffersAction]
  );

  const handleSearchMoreOffersAction = useCallback(async () => {
    dispatch(tradeStoreActions.clearError());
    const validation = validateSearchOffersAction(
      filter,
      fromChainId || '',
      fromTokenId || ''
    );
    if (validation !== true) {
      dispatch(tradeStoreActions.setError(validation));
      return;
    }
    dispatch(tradeStoreActions.setOffersVisible(true));
    const toToken = getTokenById(filter.toTokenId, filter.toChainId, chains);
    const fromToken = getTokenById(
      fromTokenId || '',
      fromChainId || '',
      chains
    );
    const query = {
      exchangeChainId: fromChainId || '',
      exchangeToken: fromToken?.symbol || '',
      chainId: filter.toChainId,
      token: toToken?.symbol || '',
      depositAmount: filter.amount,
      limit: limit.toString(),
      offset: offset.toString(),
    };
    const queryString = new URLSearchParams(query).toString();
    const res = await searchOffersRequest(queryString);
    dispatch(tradeStoreActions.addOffers(res?.items || []));
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

  const handleAcceptOfferAction = useCallback(
    async (offer: OfferType) => {
      dispatch(tradeStoreActions.clearError());
      dispatch(tradeStoreActions.setOfferId(''));
      dispatch(tradeStoreActions.setOrderTransactionId(''));
      dispatch(
        tradeStoreActions.setOrderStatus(OrderPlacingStatusType.UNINITIALIZED)
      );
      dispatch(tradeStoreActions.setModal(true));

      const validation = validateAcceptOfferAction(offer, amount);
      if (!validation) {
        dispatch(tradeStoreActions.setError(validation));
        dispatch(
          tradeStoreActions.setOrderStatus(OrderPlacingStatusType.ERROR)
        );
        return;
      }

      try {
        const exchangeToken = getTokenBySymbol(
          offer?.exchangeToken || '',
          offer?.exchangeChainId || '',
          chains
        );

        dispatch(tradeStoreActions.setOfferId(offer.offerId || ''));

        if (userChainId !== offer.exchangeChainId) {
          dispatch(
            tradeStoreActions.setOrderStatus(
              OrderPlacingStatusType.WAITING_NETWORK_SWITCH
            )
          );
        }

        const inputChain = getChainById(offer.exchangeChainId || '', chains);
        if (!inputChain) {
          throw new Error('Chain not found');
        }
        const networkSwitched = await switchMetamaskNetwork(
          userChainId,
          inputChain
        );
        if (!networkSwitched) {
          throw new Error(
            'Network switching failed. Please, switch network in your MetaMask and try again.'
          );
        }

        dispatch(
          tradeStoreActions.setOrderStatus(
            OrderPlacingStatusType.WAITING_CONFIRMATION
          )
        );

        // get signer
        const signer = getSigner();
        const ethers = getEthers();

        const amountToPay = amount;

        // set pool contract
        const _poolContract = new ethers.Contract(
          inputChain.usefulAddresses?.grtPoolAddress,
          poolAbi,
          signer
        );

        // connect signer
        const poolContract = _poolContract.connect(signer);

        // get gas estimation
        const gasEstimate =
          await poolContract.estimateGas.depositETHAndAcceptOffer(
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
        const tx = await poolContract.depositETHAndAcceptOffer(
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

        // save order to DB
        const order = await addOrderRequest(accessToken, {
          amountTokenDeposit: amountToPay,
          addressTokenDeposit: exchangeToken?.address || '',
          chainIdTokenDeposit: offer.exchangeChainId,
          destAddr: userAddress,
          offerId: offer.offerId,
          orderId: '',
          amountTokenOffer: (
            parseFloat(amount) / parseFloat(offer.exchangeRate || '1')
          ).toString(),
          hash: tx.hash || '',
        });
        if (order) {
          fetchSingleOrder(order);

          dispatch(tradeStoreActions.setOrderTransactionId(tx.hash || ''));
          dispatch(
            tradeStoreActions.setOrderStatus(OrderPlacingStatusType.COMPLETED)
          );
        } else {
          dispatch(
            tradeStoreActions.setError({
              type: 'acceptOffer',
              text: "Server error, order wasn't saved",
            })
          );
          dispatch(
            tradeStoreActions.setOrderStatus(OrderPlacingStatusType.ERROR)
          );
        }
      } catch (error: any) {
        dispatch(
          tradeStoreActions.setError({
            type: 'acceptOffer',
            text:
              getMetaMaskErrorMessage(error) ||
              'Server error, please try again later.',
          })
        );
        dispatch(
          tradeStoreActions.setOrderStatus(OrderPlacingStatusType.ERROR)
        );
      }
      dispatch(tradeStoreActions.setOfferId(''));
    },
    [
      accessToken,
      userChainId,
      poolAbi,
      userAddress,
      amount,
      chains,
      dispatch,
      fetchSingleOrder,
      getEthers,
      getSigner,
    ]
  );

  useEffect(() => {
    if (accessToken && toTokenId) {
      fetchTokenPrice(toTokenId);
    }
  }, [accessToken, fetchTokenPrice, toTokenId]);

  useEffect(() => {
    if (!fromChainId) {
      if (userChainId) {
        const userChain = getChainById(userChainId, chains);

        if (userChain) {
          dispatch(
            tradeStoreActions.setFilterValue({
              name: 'fromChainId',
              value: userChainId,
            })
          );
          const token = getTokenBySymbol(
            userChain.nativeToken || '',
            userChainId,
            chains
          );
          if (token) {
            dispatch(
              tradeStoreActions.setFilterValue({
                name: 'fromTokenId',
                value: token.coinmarketcapId || '',
              })
            );
          }
        }
      }
    }
  }, [dispatch, userChainId, chains, fromChainId]);

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

export const useTradeProvider = () => useContext(TradeContext);

export default TradeProvider;
