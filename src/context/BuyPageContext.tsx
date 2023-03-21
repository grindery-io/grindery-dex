import React, { createContext, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GRT_CONTRACT_ADDRESS } from '../constants';
import useGrinderyChains from '../hooks/useGrinderyChains';
import useOffers from '../hooks/useOffers';
import { Chain } from '../types/Chain';
import { Offer } from '../types/Offer';
import { TokenType } from '../types/TokenType';
import isNumeric from '../utils/isNumeric';
import _ from 'lodash';
import { useGrinderyNexus } from 'use-grindery-nexus';

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
  toAmount: string;
  isOffersVisible: boolean;
  searchToken: string;
  currentToChain: Chain | null;
  chainTokens: TokenType[];
  foundOffers: Offer[];
  setSearchToken: React.Dispatch<React.SetStateAction<string>>;
  handleFromChainChange: (chain: Chain) => void;
  handleToChainChange: (chain: Chain) => void;
  handleToTokenChange: (token: TokenType) => void;
  handleToAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearchClick: () => void;
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
  toAmount: '',
  isOffersVisible: false,
  searchToken: '',
  currentToChain: null,
  chainTokens: [],
  foundOffers: [],
  setSearchToken: () => {},
  handleFromChainChange: () => {},
  handleToChainChange: () => {},
  handleToTokenChange: () => {},
  handleToAmountChange: () => {},
  handleSearchClick: () => {},
});

export const BuyPageContextProvider = ({ children }: BuyPageContextProps) => {
  const { token } = useGrinderyNexus();
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
  };
  let navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState({ type: '', text: '' });
  const [toChain, setToChain] = useState<Chain | null>(null);
  const [fromChain, setFromChain] = useState<Chain | null>({
    value: 'eip155:97',
    label: 'BSCTestnet',
    icon: 'data:image/png;base64,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',
    token: 'BNB',
    rpc: [
      'https://bsc-testnet.public.blastapi.io',
      'https://data-seed-prebsc-1-s3.binance.org:8545',
      'https://bsctestapi.terminet.io/rpc',
      'https://data-seed-prebsc-1-s1.binance.org:8545',
      'https://data-seed-prebsc-2-s1.binance.org:8545',
      'https://data-seed-prebsc-1-s2.binance.org:8545',
      'https://data-seed-prebsc-2-s2.binance.org:8545',
    ],
    tokens: [
      {
        id: 4,
        address: '0x3b369B27c641637e5EE7FF9cF516Cb9F8F60cC85',
        symbol: 'GRT',
        icon: 'https://flow.grindery.org/logo192.png',
      },
    ],
  });
  const [fromToken, setFromToken] = useState<TokenType | ''>({
    id: 4,
    address: '0x3b369B27c641637e5EE7FF9cF516Cb9F8F60cC85',
    symbol: 'GRT',
    icon: 'https://flow.grindery.org/logo192.png',
  });
  const [toToken, setToToken] = useState<TokenType | ''>('');
  const [toAmount, setToAmount] = useState<string>('');
  const [isOffersVisible, setIsOffersVisible] = useState<boolean>(false);
  const [searchToken, setSearchToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { chains } = useGrinderyChains();
  const { searchOffers, offers, isLoading: isOfferLoading } = useOffers();
  const loading = isOfferLoading || isLoading;

  const foundOffers = offers.filter(
    (offer: Offer) =>
      offer.isActive &&
      parseFloat(toAmount) >= parseFloat(offer.min) &&
      parseFloat(toAmount) <= parseFloat(offer.max) &&
      offer.chain === parseFloat(toChain?.value?.split(':')?.[1] || '0') &&
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

  const handleFromChainChange = (chain: Chain) => {
    setFromChain(chain);
    setFromToken({
      id: 4,
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

  const handleToAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setToAmount(event.target.value || '');
  };

  const handleSearchClick = async () => {
    // clear errors
    setErrorMessage({ type: '', text: '' });

    // validate form input
    if (!toChain) {
      setErrorMessage({
        type: 'chain',
        text: 'Chain is required',
      });
      setIsLoading(false);
      return;
    }
    if (!toToken) {
      setErrorMessage({
        type: 'chain',
        text: 'Token is required',
      });
      setIsLoading(false);
      return;
    }
    if (!toAmount) {
      setErrorMessage({
        type: 'toAmount',
        text: 'Amount is required',
      });
      setIsLoading(false);
      return;
    }
    if (!isNumeric(toAmount)) {
      setErrorMessage({
        type: 'toAmount',
        text: 'Amount must be a number',
      });
      setIsLoading(false);
      return;
    }
    // end validation

    // show offers card
    setIsOffersVisible(true);

    searchOffers();
  };

  useEffect(() => {
    if (toChain && toToken && toAmount && token?.access_token) {
      setIsOffersVisible(true);
      setIsLoading(true);
      debouncedChangeHandler();
    } else {
      setIsOffersVisible(false);
    }
  }, [toChain, toToken, toAmount, token?.access_token]);

  useEffect(() => {
    if (!isOfferLoading) {
      setIsLoading(false);
    }
  }, [isOfferLoading]);

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
        toAmount,
        isOffersVisible,
        searchToken,
        currentToChain,
        chainTokens,
        foundOffers,
        setSearchToken,
        handleFromChainChange,
        handleToChainChange,
        handleToTokenChange,
        handleToAmountChange,
        handleSearchClick,
      }}
    >
      {children}
    </BuyPageContext.Provider>
  );
};

export default BuyPageContextProvider;
