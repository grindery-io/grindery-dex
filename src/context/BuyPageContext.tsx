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
import useTrades from '../hooks/useTrades';
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
  chainTokens: TokenType[];
  foundOffers: Offer[];
  approved: boolean;
  accepted: boolean;
  toTokenPrice: number | null;
  setAccepted: React.Dispatch<React.SetStateAction<boolean>>;
  setApproved: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchToken: React.Dispatch<React.SetStateAction<string>>;
  handleFromChainChange: (chain: Chain) => void;
  handleToChainChange: (chain: Chain) => void;
  handleToTokenChange: (token: TokenType) => void;
  handleFromAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearchClick: () => void;
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
  chainTokens: [],
  foundOffers: [],
  approved: false,
  accepted: false,
  toTokenPrice: null,
  setAccepted: () => {},
  setApproved: () => {},
  setSearchToken: () => {},
  handleFromChainChange: () => {},
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
    SELECT_FROM_CHAIN: {
      path: '/select-from-chain',
      fullPath: '/buy/select-from-chain',
    },
    SELECT_TO_CHAIN_TOKEN: {
      path: '/select-to-chain-token',
      fullPath: '/buy/select-to-chain-token',
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
  const [accepted, setAccepted] = useState<boolean>(false);
  const [toChain, setToChain] = useState<Chain | null>(null);
  const { chains } = useGrinderyChains();
  const [fromChain, setFromChain] = useState<Chain | null>(
    chains.find((c: Chain) => c.value === chain) || null
  );
  const [fromToken, setFromToken] = useState<TokenType | ''>(
    GRT_CONTRACT_ADDRESS[chain || '']
      ? {
          id: '4',
          address: GRT_CONTRACT_ADDRESS[chain || ''],
          symbol: 'GRT',
          icon: 'https://flow.grindery.org/logo192.png',
        }
      : ''
  );
  const [toToken, setToToken] = useState<TokenType | ''>('');
  const [fromAmount, setFromAmount] = useState<string>('');
  const [isOffersVisible, setIsOffersVisible] = useState<boolean>(false);
  const [searchToken, setSearchToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toTokenPrice, setToTokenPrice] = useState<number | null>(null);
  const [currentGrtBalance, setcurrentGrtBalance] = useState<string>('');
  const { saveTrade } = useTrades();
  const { searchOffers, offers, isLoading: isOfferLoading } = useOffers();
  const loading = isOfferLoading || isLoading;

  const foundOffers = offers.filter(
    (offer: Offer) =>
      offer.isActive &&
      toTokenPrice &&
      parseFloat(fromAmount) / toTokenPrice >= parseFloat(offer.min) &&
      parseFloat(fromAmount) / toTokenPrice <= parseFloat(offer.max) &&
      offer.chainId === (toChain?.value?.split(':')?.[1] || '0') &&
      typeof toToken !== 'string' &&
      offer.token === toToken?.symbol
  );

  const currentToChain: Chain | null =
    toChain && chains.find((c) => c.value === toChain.value)
      ? {
          id: toChain
            ? `0x${parseFloat(toChain.value.split(':')[1]).toString(16)}`
            : '',
          value: chains.find((c) => c.value === toChain.value)?.value || '',
          label: chains.find((c) => c.value === toChain.value)?.label || '',
          icon: chains.find((c) => c.value === toChain.value)?.icon || '',
          rpc: chains.find((c) => c.value === toChain.value)?.rpc || [],
          nativeToken:
            chains.find((c) => c.value === toChain.value)?.token || '',
        }
      : null;

  const chainTokens = (
    (toChain && chains.find((c) => c.value === toChain.value)?.tokens) ||
    []
  ).filter(
    (t: any) => !searchToken || t.symbol.toLowerCase().includes(searchToken)
  );

  const debouncedChangeHandler = _.debounce(() => {
    handleSearchClick();
  }, 1000);

  const getTokenPrice = async (symbol: string) => {
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
      } else {
        setToTokenPrice(null);
      }
    } catch (error: any) {
      console.error(error);
      setToTokenPrice(null);
    }
  };

  const handleRefreshOffersClick = async () => {
    if (toToken) {
      getTokenPrice(toToken.symbol);
    }
    handleSearchClick();
  };

  const handleFromAmountMaxClick = () => {
    setFromAmount(currentGrtBalance || '0');
  };

  const handleFromChainChange = (chain: Chain) => {
    setFromChain(chain);
    setFromToken({
      id: '4',
      address: GRT_CONTRACT_ADDRESS[chain.value] || '',
      symbol: 'GRT',
      icon: 'https://flow.grindery.org/logo192.png',
    });
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

  const handleSearchClick = async () => {
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
    if (!fromAmount) {
      setErrorMessage({
        type: 'fromAmount',
        text: 'Amount is required',
      });
      setIsLoading(false);
      return;
    }
    if (!isNumeric(fromAmount)) {
      setErrorMessage({
        type: 'fromAmount',
        text: 'Amount must be a number',
      });
      setIsLoading(false);
      return;
    }
    if (parseFloat(fromAmount) <= 0) {
      setErrorMessage({
        type: 'fromAmount',
        text: 'Amount must be greater than 0',
      });
      setIsLoading(false);
      return;
    }
    if (parseFloat(fromAmount) > parseFloat(currentGrtBalance)) {
      setErrorMessage({
        type: 'search',
        text: "You don't have enough GRT",
      });
      setIsLoading(false);
      setIsOffersVisible(false);
      return;
    }
    // end validation

    // show offers card
    setIsOffersVisible(true);

    searchOffers();
  };

  const getGrtBalance = async () => {
    // switch chain if needed
    if (chain !== fromChain?.value && fromChain) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: fromChain
                ? `0x${parseFloat(fromChain.value.split(':')[1]).toString(16)}`
                : '',
              chainName: fromChain.label,
              rpcUrls: fromChain.rpc,
              nativeCurrency: {
                name: fromChain.nativeToken,
                symbol: fromChain.nativeToken,
                decimals: 18,
              },
            },
          ],
        });
      } catch (error: any) {
        // TODO: handle chain switching error
      }
    }

    // get signer
    const signer = provider.getSigner();

    // set token contract
    const _tokenContract = new ethers.Contract(
      GRT_CONTRACT_ADDRESS[fromChain?.value || ''],
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
    const grtBalance = (tx / 10 ** 18).toString();

    // set current balance state
    setcurrentGrtBalance(grtBalance);
  };

  const handleAcceptOfferClick = async (offer: Offer) => {
    setIsLoading(true);

    if (!toTokenPrice) {
      setErrorMessage({
        type: 'acceptOffer',
        text: 'Token price is missing',
      });
      setIsLoading(false);
      return;
    }

    // switch chain if needed
    if (chain !== fromChain?.value && fromChain) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: fromChain
                ? `0x${parseFloat(fromChain.value.split(':')[1]).toString(16)}`
                : '',
              chainName: fromChain.label,
              rpcUrls: fromChain.rpc,
              nativeCurrency: {
                name: fromChain.nativeToken,
                symbol: fromChain.nativeToken,
                decimals: 18,
              },
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
    if (!approved) {
      // set GRT contract
      const _grtContract = new ethers.Contract(
        GRT_CONTRACT_ADDRESS[fromChain?.value || ''],
        tokenAbi,
        signer
      );

      // connect signer
      const grtContract = _grtContract.connect(signer);

      // approve GRT
      const txApprove = await grtContract
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
        .depositGRTWithOffer(
          ethers.utils.parseEther(fromAmount),
          offer.offerId,
          address,
          {
            gasLimit: 1000000,
          }
        )
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

      // get tradeId
      const tradeId = receipt?.logs?.[2]?.topics?.[1] || '';

      // save trade to DB
      const trade = await saveTrade({
        amountGRT: fromAmount,
        destAddr: address,
        offerId: offer.offerId,
        tradeId,
        amountToken: (parseFloat(fromAmount) / toTokenPrice).toString(),
      }).catch((error: any) => {
        console.error('saveTrade error', error);
        setErrorMessage({
          type: 'acceptOffer',
          text: error?.message || 'Server error',
        });
      });
      if (trade) {
        // reset state
        setApproved(false);
        setIsLoading(false);
        setAccepted(Boolean(offer.offerId));
      } else {
        setErrorMessage({
          type: 'acceptOffer',
          text: "Server error, trade wasn't saved",
        });
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (toChain && toToken && fromAmount && token?.access_token) {
      setIsOffersVisible(true);
      setIsLoading(true);
      debouncedChangeHandler();
    } else {
      setIsOffersVisible(false);
    }
  }, [toChain, toToken, fromAmount, token?.access_token]);

  useEffect(() => {
    if (!isOfferLoading) {
      setIsLoading(false);
    }
  }, [isOfferLoading]);

  useEffect(() => {
    if (address && chain) {
      getGrtBalance();
    }
  }, [address, chain, fromChain]);

  useEffect(() => {
    if (toToken && token?.access_token) {
      getTokenPrice(toToken.symbol);
    }
  }, [toToken, token?.access_token]);

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
        chainTokens,
        foundOffers,
        approved,
        accepted,
        toTokenPrice,
        setAccepted,
        setApproved,
        setSearchToken,
        handleFromChainChange,
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
