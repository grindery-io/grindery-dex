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
import useAbi from '../hooks/useAbi';
import { getErrorMessage } from '../utils/error';

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
  setSearchToken: React.Dispatch<React.SetStateAction<string>>;
  handleFromChainChange: (chain: Chain) => void;
  handleToChainChange: (chain: Chain) => void;
  handleToTokenChange: (token: TokenType) => void;
  handleFromAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearchClick: () => void;
  handleFromAmountMaxClick: () => void;
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
  setSearchToken: () => {},
  handleFromChainChange: () => {},
  handleToChainChange: () => {},
  handleToTokenChange: () => {},
  handleFromAmountChange: () => {},
  handleSearchClick: () => {},
  handleFromAmountMaxClick: () => {},
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
  };
  let navigate = useNavigate();
  const { tokenAbi } = useAbi();
  const [errorMessage, setErrorMessage] = useState({ type: '', text: '' });
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
  const [currentGrtBalance, setcurrentGrtBalance] = useState<string>('');

  const { searchOffers, offers, isLoading: isOfferLoading } = useOffers();
  const loading = isOfferLoading || isLoading;

  const foundOffers = offers.filter(
    (offer: Offer) =>
      offer.isActive &&
      parseFloat(fromAmount) >= parseFloat(offer.min) &&
      parseFloat(fromAmount) <= parseFloat(offer.max) &&
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
        setSearchToken,
        handleFromChainChange,
        handleToChainChange,
        handleToTokenChange,
        handleFromAmountChange,
        handleSearchClick,
        handleFromAmountMaxClick,
      }}
    >
      {children}
    </BuyPageContext.Provider>
  );
};

export default BuyPageContextProvider;
