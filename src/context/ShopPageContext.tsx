import React, { createContext, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DELIGHT_API_URL, POOL_CONTRACT_ADDRESS } from '../constants';
import useGrinderyChains from '../hooks/useGrinderyChains';
import useOffers from '../hooks/useOffers';
import { Chain } from '../types/Chain';
import { TokenType } from '../types/TokenType';
import isNumeric from '../utils/isNumeric';
import _ from 'lodash';
import { useGrinderyNexus } from 'use-grindery-nexus';
import useAbi from '../hooks/useAbi';
import { getErrorMessage } from '../utils/error';
import useOrders from '../hooks/useOrders';
import axios from 'axios';
import Offer from '../models/Offer';

// Context props
type ContextProps = {
  VIEWS: {
    [key: string]: {
      path: string;
      fullPath: string;
    };
  };
  errorMessage: { type: string; text: string; offer?: string };
  loading: boolean;
  fromChain: Chain | null;
  fromToken: TokenType | '';
  toChain: Chain | null;
  toToken: TokenType | '';
  fromAmount: string;
  isOffersVisible: boolean;
  searchToken: string;
  currentToChain: Chain | null;
  toChainTokens: TokenType[];
  currentFromChain: Chain | null;
  fromChainTokens: TokenType[];
  foundOffers: Offer[];
  approved: boolean;
  accepted: string;
  tokenPrice: number | null;
  isPricesLoading: boolean;
  accepting: string | null;
  acceptedOffer: string | null;
  showModal: boolean;
  handleModalClosed: () => void;
  handleModalOpened: () => void;
  setAccepted: React.Dispatch<React.SetStateAction<string>>;
  setApproved: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchToken: React.Dispatch<React.SetStateAction<string>>;
  handleFromChainChange: (chain: Chain) => void;
  handleFromTokenChange: (token: TokenType) => void;
  handleToChainChange: (chain: Chain) => void;
  handleToTokenChange: (token: TokenType) => void;
  handleFromAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearchClick: (amount: string, silent?: boolean) => void;
  handleFromAmountMaxClick: () => void;
  handleAcceptOfferClick: (offer: Offer) => void;
};

// Context provider props
type ShopPageContextProps = {
  children: React.ReactNode;
};

// Init context
export const ShopPageContext = createContext<ContextProps>({
  VIEWS: {},
  errorMessage: { type: '', text: '' },
  loading: false,
  fromChain: null,
  fromToken: '',
  toChain: null,
  toToken: '',
  fromAmount: '',
  isOffersVisible: false,
  searchToken: '',
  currentToChain: null,
  toChainTokens: [],
  currentFromChain: null,
  fromChainTokens: [],
  foundOffers: [],
  approved: false,
  accepted: '',
  tokenPrice: null,
  isPricesLoading: false,
  accepting: null,
  acceptedOffer: null,
  showModal: false,
  handleModalClosed: () => {},
  handleModalOpened: () => {},
  setAccepted: () => {},
  setApproved: () => {},
  setSearchToken: () => {},
  handleFromChainChange: () => {},
  handleFromTokenChange: () => {},
  handleToChainChange: () => {},
  handleToTokenChange: () => {},
  handleFromAmountChange: () => {},
  handleSearchClick: () => {},
  handleFromAmountMaxClick: () => {},
  handleAcceptOfferClick: () => {},
});

export const ShopPageContextProvider = ({ children }: ShopPageContextProps) => {
  const { token, provider, ethers, address, chain } = useGrinderyNexus();
  const VIEWS = {
    ROOT: { path: '', fullPath: '/buy/shop' },

    ACCEPT_OFFER: {
      path: '/accept/:offerId',
      fullPath: '/buy/shop/accept/:offerId',
    },
  };
  let navigate = useNavigate();
  const { tokenAbi, poolAbi } = useAbi();
  const [errorMessage, setErrorMessage] = useState<{
    type: string;
    text: string;
    offer?: string;
  }>({ type: '', text: '' });
  const [approved, setApproved] = useState<boolean>(false);
  const [accepted, setAccepted] = useState<string>('');
  const [acceptedOffer, setAcceptedoffer] = useState<string | null>(null);
  const [toChain, setToChain] = useState<Chain | null>(null);
  const { chains, isLoading: chainsIsLoading } = useGrinderyChains();
  const [fromChain, setFromChain] = useState<Chain | null>(null);
  const [fromToken, setFromToken] = useState<TokenType | ''>('');
  const [toToken, setToToken] = useState<TokenType | ''>('');
  const [fromAmount, setFromAmount] = useState<string>('');
  const [isOffersVisible, setIsOffersVisible] = useState<boolean>(false);
  const [searchToken, setSearchToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tokenPrice, setTokenPrice] = useState<number | null>(null);
  const [accepting, setAccepting] = useState<string | null>(null);
  const [fromTokenBalance, setFromTokenBalance] = useState<string>('');
  const { saveOrder } = useOrders();
  const { searchOffers, offers, isLoading: isOfferLoading } = useOffers();
  const [isPricesLoading, setIsPricesLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const loading = isOfferLoading || isLoading;

  const foundOffers = offers.filter((o: Offer) => o.isActive && o.amount);

  const filteredToChain = chains.find(
    (c) => toChain && c.value === toChain.value
  );
  const currentToChain: Chain | null =
    toChain && filteredToChain
      ? {
          ...(filteredToChain || {}),
          idHex: toChain ? `0x${parseFloat(toChain.chainId).toString(16)}` : '',
          value: filteredToChain?.value || '',
          label: filteredToChain?.label || '',
          icon: filteredToChain?.icon || '',
          rpc: filteredToChain?.rpc || [],
          nativeToken: filteredToChain?.token || '',
        }
      : null;

  const toChainTokens = (
    (toChain && chains.find((c) => c.value === toChain.value)?.tokens) ||
    []
  ).filter(
    (t: any) => !searchToken || t.symbol.toLowerCase().includes(searchToken)
  );
  const filteredFromChain = chains.find(
    (c) => fromChain && c.value === fromChain.value
  );
  const currentFromChain: Chain | null =
    fromChain && filteredFromChain
      ? {
          ...(filteredFromChain || {}),
          idHex: fromChain
            ? `0x${parseFloat(fromChain.chainId).toString(16)}`
            : '',
          value: filteredFromChain?.value || '',
          label: filteredFromChain?.label || '',
          icon: filteredFromChain?.icon || '',
          rpc: filteredFromChain?.rpc || [],
          nativeToken: filteredFromChain?.token || '',
        }
      : null;

  const fromChainTokens = (
    (fromChain && chains.find((c) => c.value === fromChain.value)?.tokens) ||
    []
  ).filter(
    (t: any) => !searchToken || t.symbol.toLowerCase().includes(searchToken)
  );

  const handleModalClosed = () => {
    setShowModal(false);
  };

  const handleModalOpened = () => {
    setShowModal(true);
  };

  const getToTokenPrice = async (symbol: string) => {
    setIsPricesLoading(true);
    try {
      const res = await axios.get(
        `${DELIGHT_API_URL}/coinmarketcap?token=ETH`,
        {
          headers: {
            Authorization: `Bearer ${token?.access_token || ''}`,
          },
        }
      );
      if (res?.data?.price) {
        setTokenPrice(res?.data?.price);
        setIsPricesLoading(false);
      } else {
        setTokenPrice(null);
        setIsPricesLoading(false);
      }
    } catch (error: any) {
      console.error(error);
      setTokenPrice(null);
      setIsPricesLoading(false);
    }
  };

  const handleFromAmountMaxClick = () => {
    setFromAmount(fromTokenBalance || '0');
  };

  const handleFromChainChange = (chain: Chain) => {
    setFromChain(chain);
    setFromToken('');
  };

  const handleFromTokenChange = (token: TokenType) => {
    setFromToken(token);
    setSearchToken('');
    setErrorMessage({
      type: '',
      text: '',
    });
    navigate(VIEWS.ROOT.fullPath);
  };

  const handleToChainChange = (chain: Chain) => {
    setToChain(chain);
    setToToken('');
  };

  const handleToTokenChange = (token: TokenType) => {
    setToToken(token);
    setSearchToken('');
    setErrorMessage({
      type: '',
      text: '',
    });
    navigate(VIEWS.ROOT.fullPath);
  };

  const handleFromAmountChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFromAmount(event.target.value || '');
  };

  const handleSearchClick = async (amount: string, silent: boolean = false) => {
    // clear errors
    setErrorMessage({ type: '', text: '' });

    // validate form input
    if (!fromChain) {
      setErrorMessage({
        type: 'fromChain',
        text: 'Chain is required',
      });
      setIsLoading(false);
      return;
    }
    if (!fromToken) {
      setErrorMessage({
        type: 'fromChain',
        text: 'Token is required',
      });
      setIsLoading(false);
      return;
    }
    if (!toChain) {
      setErrorMessage({
        type: 'toChain',
        text: 'Chain is required',
      });
      setIsLoading(false);
      return;
    }
    if (!toToken) {
      setErrorMessage({
        type: 'toChain',
        text: 'Token is required',
      });
      setIsLoading(false);
      return;
    }
    if (!amount) {
      setErrorMessage({
        type: 'fromAmount',
        text: 'Amount is required',
      });
      setIsLoading(false);
      return;
    }
    if (!isNumeric(amount)) {
      setErrorMessage({
        type: 'fromAmount',
        text: 'Amount must be a number',
      });
      setIsLoading(false);
      return;
    }
    if (parseFloat(amount) <= 0) {
      setErrorMessage({
        type: 'fromAmount',
        text: 'Amount must be greater than 0',
      });
      setIsLoading(false);
      return;
    }
    if (parseFloat(amount) > parseFloat(fromTokenBalance)) {
      setErrorMessage({
        type: 'search',
        text: "You don't have enough funds",
      });
      setIsLoading(false);
      setIsOffersVisible(false);
      return;
    }
    // end validation

    // show offers card
    setIsOffersVisible(true);

    searchOffers(
      silent,
      `?depositChainId=${fromChain.chainId}&depositTokenId=${fromToken.symbol}&offerChain=${toChain.chainId}&offerToken=${toToken.symbol}&depositAmount=${amount}`
    );
  };

  /*const debouncedChangeHandler = useCallback(
    _.debounce((amount: string) => {
      handleSearchClick(amount);
    }, 1000),
    [fromChain, fromToken, toChain, toToken, fromTokenBalance]
  );*/

  const params = {
    headers: {
      Authorization: `Bearer ${token?.access_token || ''}`,
    },
  };

  const getFromTokenBalance = async () => {
    if (!fromToken || typeof fromToken === 'string' || !fromToken.address) {
      return;
    }

    const res = await axios.get(
      `${DELIGHT_API_URL}/view-blockchains/balance-token?chainId=${fromChain?.chainId}&address=${address}&tokenAddress=${fromToken.address}`,
      params
    );

    // convert wei to string
    const _balance = res?.data ? (res.data / 10 ** 18).toString() : '0';

    // set current balance state
    setFromTokenBalance(_balance);
  };

  const handleAcceptOfferClick = async (offer: Offer) => {
    setErrorMessage({
      type: '',
      text: '',
      offer: '',
    });
    setAccepted('');
    handleModalOpened();
    if (!offer.offerId) {
      setErrorMessage({
        type: 'acceptOffer',
        text: 'offer id is missing',
      });

      return;
    }
    if (!fromToken) {
      setErrorMessage({
        type: 'acceptOffer',
        offer: offer.offerId,
        text: 'Token price is missing',
      });

      return;
    }

    if (!tokenPrice) {
      setErrorMessage({
        type: 'acceptOffer',
        offer: offer.offerId,
        text: 'Token price is missing',
      });

      return;
    }

    if (!offer.amount) {
      setErrorMessage({
        type: 'acceptOffer',
        offer: offer.offerId,
        text: 'Tokens amount is missing',
      });

      return;
    }

    if (!offer.exchangeRate) {
      setErrorMessage({
        type: 'acceptOffer',
        offer: offer.offerId,
        text: 'Exchange rate is missing',
      });

      return;
    }

    const amount = (
      parseFloat(offer.amount) * parseFloat(offer.exchangeRate)
    ).toString();

    console.log('amount', amount);

    if (parseFloat(fromTokenBalance) < parseFloat(amount)) {
      setErrorMessage({
        type: 'acceptOffer',
        offer: offer.offerId,
        text: 'Not enough funds',
      });

      return;
    }

    setAccepting(offer.offerId || '');

    // switch chain if needed
    if (chain !== fromChain?.value && fromChain) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [
            {
              chainId: fromChain
                ? `0x${parseFloat(fromChain.chainId).toString(16)}`
                : '',
            },
          ],
        });
      } catch (error: any) {
        // TODO: handle chain switching error
      }
    }

    // get signer
    const signer = provider.getSigner();

    // approve tokens first
    if (!approved && fromToken.address !== '0x0') {
      // set token contract
      const _fromTokenContract = new ethers.Contract(
        fromToken.address,
        tokenAbi,
        signer
      );

      // connect signer
      const fromTokenContract = _fromTokenContract.connect(signer);

      // approve tokens
      const txApprove = await fromTokenContract
        .approve(
          POOL_CONTRACT_ADDRESS[fromChain?.value || ''],
          ethers.utils.parseEther(amount)
        )
        .catch((error: any) => {
          setErrorMessage({
            type: 'acceptOffer',
            text: getErrorMessage(error.error, 'Approval transaction error'),
            offer: offer.offerId,
          });
          console.error('approve error', error.error);
          setAccepting(null);
          return;
        });

      // stop executing if approval failed
      if (!txApprove) {
        setAccepting(null);
        return;
      }

      // wait for approval transaction
      try {
        await txApprove.wait();
      } catch (error: any) {
        setErrorMessage({
          type: 'acceptOffer',
          text: error?.message || 'Transaction error',
          offer: offer.offerId,
        });
        console.error('txApprove.wait error', error);
        setAccepting(null);
        return;
      }
      setAccepting(null);
      setApproved(true);

      // accept if tokens were approved
    } else {
      // set pool contract
      const _poolContract = new ethers.Contract(
        POOL_CONTRACT_ADDRESS[fromChain?.value || ''],
        poolAbi,
        signer
      );

      // connect signer
      const poolContract = _poolContract.connect(signer);

      // get gas estimation
      const gasEstimate =
        await poolContract.estimateGas.depositETHAndAcceptOffer(
          offer.offerId,
          address,
          ethers.utils.parseEther(
            parseFloat(offer.amount).toFixed(18).toString()
          ),
          {
            value: ethers.utils.parseEther(amount),
          }
        );

      // create transaction
      const tx = await poolContract
        .depositETHAndAcceptOffer(
          offer.offerId,
          address,
          ethers.utils.parseEther(
            parseFloat(offer.amount).toFixed(18).toString()
          ),
          {
            value: ethers.utils.parseEther(amount),
            gasLimit: gasEstimate,
          }
        )
        .catch((error: any) => {
          setErrorMessage({
            type: 'acceptOffer',
            text: getErrorMessage(
              error.error,
              'Accepting offer transaction error'
            ),
            offer: offer.offerId,
          });
          console.error('depositGRTWithOffer error', error);
          setAccepting(null);
          return;
        });

      // stop execution if offer activation failed
      if (!tx) {
        setAccepting(null);
        return;
      }

      // wait for activation transaction
      try {
        await tx.wait();
      } catch (error: any) {
        setErrorMessage({
          type: 'acceptOffer',
          text: error?.message || 'Transaction error',
          offer: offer.offerId,
        });
        console.error('tx.wait error', error);
        setAccepting(null);
        return;
      }

      // get receipt
      const receipt = await provider.getTransactionReceipt(tx.hash);

      // get orderId
      const orderId = receipt?.logs?.[0]?.topics?.[2] || '';

      // save order to DB
      const order = await saveOrder({
        amountTokenDeposit: amount,
        addressTokenDeposit: fromToken.address,
        chainIdTokenDeposit: fromToken.chainId,
        destAddr: address,
        offerId: offer.offerId,
        orderId,
        amountTokenOffer: offer.amount,
        hash: tx.hash || '',
      }).catch((error: any) => {
        console.error('saveOrder error', error);
        setErrorMessage({
          type: 'acceptOffer',
          text: error?.message || 'Server error',
          offer: offer.offerId,
        });
      });
      if (order) {
        // reset state
        setApproved(false);
        setAccepting(null);
        setAccepted(tx.hash || '');
        setAcceptedoffer(offer.offerId || null);
      } else {
        setErrorMessage({
          type: 'acceptOffer',
          text: "Server error, order wasn't saved",
          offer: offer.offerId,
        });
        setAccepting(null);
      }
    }
  };

  useEffect(() => {
    if (
      toChain &&
      toToken &&
      fromAmount &&
      fromChain &&
      fromToken &&
      token?.access_token
    ) {
      setIsOffersVisible(true);
      setIsLoading(true);
      //debouncedChangeHandler(fromAmount);
    } else {
      setIsOffersVisible(false);
    }
  }, [toChain, toToken, fromAmount, fromChain, fromToken, token?.access_token]);

  useEffect(() => {
    if (!isOfferLoading) {
      setIsLoading(false);
    }
  }, [isOfferLoading]);

  useEffect(() => {
    if (address && chain) {
      getFromTokenBalance();
    }
  }, [address, chain, fromChain, fromToken]);

  useEffect(() => {
    if (toToken && token?.access_token) {
      getToTokenPrice(toToken.symbol);
    }
  }, [toToken, token?.access_token]);

  useEffect(() => {
    if (!chainsIsLoading) {
      setToChain(chains.find((c: Chain) => c.chainId === '97') || null);
      setToToken(
        chains
          .find((c: Chain) => c.chainId === '97')
          ?.tokens?.find((t: TokenType) => t.symbol === 'BNB') || ''
      );
      setFromChain(chains.find((c: Chain) => c.chainId === '5') || null);
      setFromToken(
        chains
          .find((c: Chain) => c.chainId === '5')
          ?.tokens?.find((t: TokenType) => t.symbol === 'ETH') || ''
      );
    }
  }, [chains, chainsIsLoading]);

  return (
    <ShopPageContext.Provider
      value={{
        VIEWS,
        errorMessage,
        loading,
        fromChain,
        fromToken,
        toChain,
        toToken,
        fromAmount,
        isOffersVisible,
        searchToken,
        currentToChain,
        toChainTokens,
        currentFromChain,
        fromChainTokens,
        foundOffers,
        approved,
        accepted,
        tokenPrice,
        isPricesLoading,
        accepting,
        acceptedOffer,
        showModal,
        handleModalClosed,
        handleModalOpened,
        setAccepted,
        setApproved,
        setSearchToken,
        handleFromChainChange,
        handleFromTokenChange,
        handleToChainChange,
        handleToTokenChange,
        handleFromAmountChange,
        handleSearchClick,
        handleFromAmountMaxClick,
        handleAcceptOfferClick,
      }}
    >
      {children}
    </ShopPageContext.Provider>
  );
};

export default ShopPageContextProvider;
