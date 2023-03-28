import React, { createContext, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DELIGHT_API_URL,
  GRT_CONTRACT_ADDRESS,
  POOL_CONTRACT_ADDRESS,
} from '../constants';
import useGrinderyChains from '../hooks/useGrinderyChains';
import useOffers from '../hooks/useOffers';
import { Chain } from '../types/Chain';
import { Offer } from '../types/Offer';
import { TokenType } from '../types/TokenType';
import isNumeric from '../utils/isNumeric';
import _ from 'lodash';
import { useGrinderyNexus } from 'use-grindery-nexus';
import useAbi from '../hooks/useAbi';
import { getErrorMessage } from '../utils/error';
import useOrders from '../hooks/useOrders';
import axios from 'axios';

// Context props
type ContextProps = {
  VIEWS: {
    [key: string]: {
      path: string;
      fullPath: string;
    };
  };
  errorMessage: { type: string; text: string };
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
  toTokenPrice: number | null;
  fromTokenPrice: number | null;
  isPricesLoading: boolean;
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
  handleRefreshOffersClick: () => void;
};

// Context provider props
type BuyPageContextProps = {
  children: React.ReactNode;
};

// Init context
export const BuyPageContext = createContext<ContextProps>({
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
  toTokenPrice: null,
  fromTokenPrice: null,
  isPricesLoading: false,
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
  handleRefreshOffersClick: () => {},
});

export const BuyPageContextProvider = ({ children }: BuyPageContextProps) => {
  const { token, provider, ethers, address, chain } = useGrinderyNexus();
  const VIEWS = {
    ROOT: { path: '', fullPath: '/buy' },
    SELECT_FROM: {
      path: '/select-from',
      fullPath: '/buy/select-from',
    },
    SELECT_TO: {
      path: '/select-to',
      fullPath: '/buy/select-to',
    },
    ACCEPT_OFFER: {
      path: '/accept/:offerId',
      fullPath: '/buy/accept/:offerId',
    },
    HISTORY: {
      path: '/history',
      fullPath: '/buy/history',
    },
  };
  let navigate = useNavigate();
  const { tokenAbi, poolAbi } = useAbi();
  const [errorMessage, setErrorMessage] = useState({ type: '', text: '' });
  const [approved, setApproved] = useState<boolean>(false);
  const [accepted, setAccepted] = useState<string>('');
  const [toChain, setToChain] = useState<Chain | null>(null);
  const { chains, isLoading: chainsIsLoading } = useGrinderyChains();
  const [fromChain, setFromChain] = useState<Chain | null>(null);
  const [fromToken, setFromToken] = useState<TokenType | ''>('');
  const [toToken, setToToken] = useState<TokenType | ''>('');
  const [fromAmount, setFromAmount] = useState<string>('');
  const [isOffersVisible, setIsOffersVisible] = useState<boolean>(false);
  const [searchToken, setSearchToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toTokenPrice, setToTokenPrice] = useState<number | null>(null);
  const [fromTokenPrice, setFromTokenPrice] = useState<number | null>(null);
  const [fromTokenBalance, setFromTokenBalance] = useState<string>('');
  const { saveOrder } = useOrders();
  const { searchOffers, offers, isLoading: isOfferLoading } = useOffers();
  const [isPricesLoading, setIsPricesLoading] = useState(false);
  const loading = isOfferLoading || isLoading;

  const foundOffers = offers;

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

  const getToTokenPrice = async (symbol: string) => {
    setIsPricesLoading(true);
    try {
      const res = await axios.get(
        `${DELIGHT_API_URL}/coinmarketcap?token=${symbol}`,
        {
          headers: {
            Authorization: `Bearer ${token?.access_token || ''}`,
          },
        }
      );
      if (res?.data?.price) {
        setToTokenPrice(res?.data?.price);
        setIsPricesLoading(false);
      } else {
        setToTokenPrice(null);
        setIsPricesLoading(false);
      }
    } catch (error: any) {
      console.error(error);
      setToTokenPrice(null);
      setIsPricesLoading(false);
    }
  };

  const getFromTokenPrice = async (symbol: string) => {
    setIsPricesLoading(true);
    try {
      const res = await axios.get(
        `${DELIGHT_API_URL}/coinmarketcap?token=${symbol}`,
        {
          headers: {
            Authorization: `Bearer ${token?.access_token || ''}`,
          },
        }
      );
      if (res?.data?.price) {
        setFromTokenPrice(res?.data?.price);
        setIsPricesLoading(false);
      } else {
        setFromTokenPrice(null);
        setIsPricesLoading(false);
      }
    } catch (error: any) {
      console.error(error);
      setFromTokenPrice(null);
      setIsPricesLoading(false);
    }
  };

  const handleRefreshOffersClick = async () => {
    if (toToken) {
      getToTokenPrice(toToken.symbol);
    }
    if (fromToken) {
      getFromTokenPrice(fromToken.symbol);
    }
    handleSearchClick(fromAmount, true);
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

  const debouncedChangeHandler = useCallback(
    _.debounce((amount: string) => {
      handleSearchClick(amount);
    }, 1000),
    [fromChain, fromToken, toChain, toToken, fromTokenBalance]
  );

  const getFromTokenBalance = async () => {
    // switch chain if needed
    if (!fromToken || typeof fromToken === 'string' || !fromToken.address) {
      return;
    }
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

    // If native token
    if (fromToken.address === '0x0') {
      const balance = await provider.getBalance(address);
      const balanceInEth = ethers.utils.formatEther(balance);

      setFromTokenBalance(balanceInEth);
    } else {
      // if ERC-20 token

      // get signer
      const signer = provider.getSigner();

      // set token contract
      const _tokenContract = new ethers.Contract(
        fromToken.address,
        tokenAbi,
        signer
      );

      // connect signer
      const tokenContract = _tokenContract.connect(signer);

      // get balance
      const tx = await tokenContract.balanceOf(address).catch((error: any) => {
        setErrorMessage({
          type: 'fromAmount',
          text: getErrorMessage(error.error, 'BalanceOf transaction error'),
        });
        console.error('BalanceOf error', error.error);
        return;
      });

      // convert wei to string
      const _balance = (tx / 10 ** 18).toString();

      // set current balance state
      setFromTokenBalance(_balance);
    }
  };

  const handleAcceptOfferClick = async (offer: Offer) => {
    if (!fromToken) {
      setErrorMessage({
        type: 'acceptOffer',
        text: 'Token price is missing',
      });

      return;
    }

    if (!toTokenPrice) {
      setErrorMessage({
        type: 'acceptOffer',
        text: 'Token price is missing',
      });

      return;
    }

    if (!fromTokenPrice) {
      setErrorMessage({
        type: 'acceptOffer',
        text: 'Token price is missing',
      });

      return;
    }

    setIsLoading(true);

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
          ethers.utils.parseEther(fromAmount)
        )
        .catch((error: any) => {
          setErrorMessage({
            type: 'acceptOffer',
            text: getErrorMessage(error.error, 'Approval transaction error'),
          });
          console.error('approve error', error.error);
          setIsLoading(false);
          return;
        });

      // stop executing if approval failed
      if (!txApprove) {
        setIsLoading(false);
        return;
      }

      // wait for approval transaction
      try {
        await txApprove.wait();
      } catch (error: any) {
        setErrorMessage({
          type: 'acceptOffer',
          text: error?.message || 'Transaction error',
        });
        console.error('txApprove.wait error', error);
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
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

      // create transaction
      const tx = await poolContract
        .depositETHAndAcceptOffer(offer.offerId, address, {
          value: ethers.utils.parseEther(fromAmount),
          gasLimit: 1000000,
        })
        .catch((error: any) => {
          setErrorMessage({
            type: 'acceptOffer',
            text: getErrorMessage(
              error.error,
              'Accepting offer transaction error'
            ),
          });
          console.error('depositGRTWithOffer error', error);
          setIsLoading(false);
          return;
        });

      // stop execution if offer activation failed
      if (!tx) {
        setIsLoading(false);
        return;
      }

      // wait for activation transaction
      try {
        await tx.wait();
      } catch (error: any) {
        setErrorMessage({
          type: 'acceptOffer',
          text: error?.message || 'Transaction error',
        });
        console.error('tx.wait error', error);
        setIsLoading(false);
        return;
      }

      // get receipt
      const receipt = await provider.getTransactionReceipt(tx.hash);

      // get orderId
      const orderId = receipt?.logs?.[0]?.topics?.[1] || '';

      // save order to DB
      const order = await saveOrder({
        amountTokenDeposit: fromAmount,
        addressTokenDeposit: fromToken.address,
        chainIdTokenDeposit: fromToken.chainId,
        destAddr: address,
        offerId: offer.offerId,
        orderId,
        amountTokenOffer: (
          (parseFloat(fromAmount) * fromTokenPrice) /
          toTokenPrice
        ).toString(),
        hash: tx.hash || '',
      }).catch((error: any) => {
        console.error('saveOrder error', error);
        setErrorMessage({
          type: 'acceptOffer',
          text: error?.message || 'Server error',
        });
      });
      if (order) {
        // reset state
        setApproved(false);
        setIsLoading(false);
        setAccepted(tx.hash || '');
      } else {
        setErrorMessage({
          type: 'acceptOffer',
          text: "Server error, order wasn't saved",
        });
        setIsLoading(false);
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
      debouncedChangeHandler(fromAmount);
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
    if (fromToken && token?.access_token) {
      getFromTokenPrice(fromToken.symbol);
    }
  }, [fromToken, token?.access_token]);

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
    <BuyPageContext.Provider
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
        toTokenPrice,
        fromTokenPrice,
        isPricesLoading,
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
        handleRefreshOffersClick,
      }}
    >
      {children}
    </BuyPageContext.Provider>
  );
};

export default BuyPageContextProvider;
