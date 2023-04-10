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
  selectUserAddress,
  TradeFilterFieldName,
  Tradefilter,
  clearTradeError,
  selectTradeFilter,
  setTradeAcceptedOfferTx,
  setTradeApproved,
  setTradeError,
  setTradeFilterValue,
  setTradeFromTokenBalance,
  setTradeFromTokenPrice,
  setTradeLoading,
  setTradeOffers,
  setTradeOffersVisible,
  setTradePricesLoading,
  setTradeToTokenPrice,
  selectChainsItems,
} from '../store';
import {
  getChainIdHex,
  getErrorMessage,
  getOrderIdFromReceipt,
  getTokenById,
  isNumeric,
} from '../utils';
import { useUserController } from './UserController';
import {
  searchOffersRequest,
  getTokenBalanceRequest,
  getTokenPriceById,
  addOrderRequest,
} from '../services';
import { OfferType, TokenType, ChainType } from '../types';
import { POOL_CONTRACT_ADDRESS } from '../config';

// Context props
type ContextProps = {
  handleAcceptOfferAction: (
    offer: OfferType,
    accessToken: string,
    userChainId: string,
    approved: boolean,
    exchangeToken: TokenType,
    tokenAbi: any,
    poolAbi: any,
    userAddress: string,
    amount: string
  ) => void;
  handleSearchOffersAction: (
    accessToken: string,
    filter: Tradefilter,
    chains: ChainType[],
    fromTokenBalance: string
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
  const userAddress = useAppSelector(selectUserAddress);
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectTradeFilter);
  const { fromChainId, fromTokenId, toTokenId } = filter;
  const { getSigner, getEthers, getProvider } = useUserController();
  const chains = useAppSelector(selectChainsItems);
  const fromToken = getTokenById(
    filter.fromTokenId,
    filter.fromChainId,
    chains
  );

  const fetchTokenPrices = useCallback(
    async (accessToken: string, fromTokenId: string, toTokenId: string) => {
      dispatch(setTradePricesLoading(true));
      const fromPrice = await getTokenPriceById(accessToken, fromTokenId);
      const toPrice = await getTokenPriceById(accessToken, toTokenId);
      dispatch(setTradeFromTokenPrice(fromPrice));
      dispatch(setTradeToTokenPrice(toPrice));
      dispatch(setTradePricesLoading(false));
    },
    [dispatch]
  );

  const fetchFromTokenBalance = useCallback(
    async (
      accessToken: string,
      chainId: string,
      address: string,
      tokenAddress: string
    ) => {
      const balance = await getTokenBalanceRequest(
        accessToken,
        chainId,
        address,
        tokenAddress
      );
      dispatch(setTradeFromTokenBalance(balance || '0'));
    },
    [dispatch]
  );

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

  const validateSearchOffersAction = (
    filter: Tradefilter,
    fromTokenBalance: string
  ): boolean => {
    if (!filter.fromChainId) {
      dispatch(
        setTradeError({
          type: 'fromChain',
          text: 'Chain is required',
        })
      );

      return false;
    }
    if (!filter.fromTokenId) {
      dispatch(
        setTradeError({
          type: 'fromChain',
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
  };

  const handleSearchOffersAction = async (
    accessToken: string,
    filter: Tradefilter,
    chains: ChainType[],
    fromTokenBalance: string
  ) => {
    dispatch(clearTradeError());
    if (!validateSearchOffersAction(filter, fromTokenBalance)) {
      return;
    }
    dispatch(setTradeLoading(true));
    dispatch(setTradeOffersVisible(true));
    const fromToken = getTokenById(
      filter.fromTokenId,
      filter.fromChainId,
      chains
    );
    const toToken = getTokenById(filter.toTokenId, filter.toChainId, chains);
    const query = {
      exchangeChainId: filter.fromChainId,
      exchangeToken: fromToken?.symbol || '',
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
  };

  const validateAcceptOfferAction = (
    offer: OfferType,
    amount: string
  ): boolean => {
    if (!offer.offerId) {
      dispatch(
        setTradeError({
          type: 'acceptOffer',
          text: 'offer id is missing',
        })
      );

      return false;
    }

    if (!offer.amount) {
      dispatch(
        setTradeError({
          type: 'acceptOffer',
          text: 'Tokens amount is missing',
        })
      );

      return false;
    }

    if (!offer.exchangeRate) {
      dispatch(
        setTradeError({
          type: 'acceptOffer',
          text: 'Exchange rate is missing',
        })
      );

      return false;
    }

    if (!offer.exchangeChainId) {
      dispatch(
        setTradeError({
          type: 'acceptOffer',
          text: 'Offer exchange chain is not set',
        })
      );

      return false;
    }

    return true;
  };

  const handleAcceptOfferAction = async (
    offer: OfferType,
    accessToken: string,
    userChainId: string,
    approved: boolean,
    exchangeToken: TokenType,
    tokenAbi: any,
    poolAbi: any,
    userAddress: string,
    amount: string
  ) => {
    dispatch(clearTradeError());
    dispatch(setTradeLoading(false));

    if (!validateAcceptOfferAction(offer, amount)) {
      return;
    }

    dispatch(setTradeLoading(true));

    // switch chain if needed
    if (!userChainId || userChainId !== offer.exchangeChainId) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [
            {
              chainId: getChainIdHex(offer.exchangeChainId || ''),
            },
          ],
        });
      } catch (error: any) {
        // TODO: handle chain switching error
      }
    }

    // get signer
    const signer = getSigner();
    const ethers = getEthers();
    const provider = getProvider();

    const amountToPay = amount;

    // approve tokens first
    if (!approved && exchangeToken.address !== '0x0') {
      // set token contract
      const _fromTokenContract = new ethers.Contract(
        exchangeToken.address,
        tokenAbi,
        signer
      );

      // connect signer
      const fromTokenContract = _fromTokenContract.connect(signer);

      // approve tokens
      const txApprove = await fromTokenContract
        .approve(
          POOL_CONTRACT_ADDRESS[`eip155:${offer.exchangeChainId}`],
          ethers.utils.parseEther(amountToPay)
        )
        .catch((error: any) => {
          dispatch(
            setTradeError({
              type: 'acceptOffer',
              text: getErrorMessage(error.error, 'Approval transaction error'),
            })
          );
          console.error('approve error', error.error);
          dispatch(setTradeLoading(false));
          return;
        });

      // stop executing if approval failed
      if (!txApprove) {
        dispatch(setTradeLoading(false));
        return;
      }

      // wait for approval transaction
      try {
        await txApprove.wait();
      } catch (error: any) {
        dispatch(
          setTradeError({
            type: 'acceptOffer',
            text: error?.message || 'Transaction error',
          })
        );
        console.error('txApprove.wait error', error);
        dispatch(setTradeLoading(false));
        return;
      }
      dispatch(setTradeLoading(false));
      dispatch(setTradeApproved(true));

      // accept if tokens were approved
    } else {
      // set pool contract
      const _poolContract = new ethers.Contract(
        POOL_CONTRACT_ADDRESS[`eip155:${offer.exchangeChainId}`],
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
              text: getErrorMessage(
                error.error,
                'Accepting offer transaction error'
              ),
            })
          );
          console.error('depositGRTWithOffer error', error);
          dispatch(setTradeLoading(false));
          return;
        });

      // stop execution if offer activation failed
      if (!tx) {
        dispatch(setTradeLoading(false));
        return;
      }

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
        dispatch(setTradeLoading(false));
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
      });
      if (order) {
        dispatch(setTradeApproved(false));
        dispatch(setTradeAcceptedOfferTx(tx.hash || ''));
      } else {
        dispatch(
          setTradeError({
            type: 'acceptOffer',
            text: "Server error, order wasn't saved",
          })
        );
      }
      dispatch(setTradeLoading(false));
    }
  };

  useEffect(() => {
    if (accessToken && fromTokenId && toTokenId) {
      fetchTokenPrices(accessToken, fromTokenId, toTokenId);
    }
  }, [accessToken, fetchTokenPrices, fromTokenId, toTokenId]);

  useEffect(() => {
    if (accessToken && fromChainId && userAddress && fromToken?.address) {
      fetchFromTokenBalance(
        accessToken,
        fromChainId,
        userAddress,
        fromToken?.address
      );
    }
  }, [
    accessToken,
    fromChainId,
    userAddress,
    fromToken?.address,
    fetchFromTokenBalance,
  ]);

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
