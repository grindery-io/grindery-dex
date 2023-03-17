import React, { createContext, useEffect, useState } from 'react';
import { useGrinderyNexus } from 'use-grindery-nexus';
import { Chain } from '../types/Chain';
import useGrinderyChains from '../hooks/useGrinderyChains';
import { GRT_CONTRACT_ADDRESS } from '../constants';
import useAbi from '../hooks/useAbi';

function isNumeric(value: string) {
  return /^\d*(\.\d+)?$/.test(value);
}

// Context props
type ContextProps = {
  VIEWS: {
    [key: string]: {
      path: string;
      fullPath: string;
    };
  };
  userAddress: string | null;
  amountGRT: string;
  loading: boolean;
  trxHash: string | null;
  error: boolean;
  errorMessage: { type: string; text: string };
  chain: string | number;
  currentChain: Chain | null;
  setUserAddress: React.Dispatch<React.SetStateAction<string | null>>;
  setAmountGRT: React.Dispatch<React.SetStateAction<string>>;
  setErrorMessage: React.Dispatch<
    React.SetStateAction<{ type: string; text: string }>
  >;
  setChain: React.Dispatch<React.SetStateAction<string | number>>;
  handleGetClick: () => void;
};

// Context provider props
type FaucetPageContextProps = {
  children: React.ReactNode;
};

// Init context
export const FaucetPageContext = createContext<ContextProps>({
  VIEWS: {},
  userAddress: '',
  amountGRT: '',
  loading: false,
  trxHash: '',
  error: false,
  errorMessage: { type: '', text: '' },
  chain: '',
  currentChain: null,
  setUserAddress: () => {},
  setAmountGRT: () => {},
  setErrorMessage: () => {},
  setChain: () => {},
  handleGetClick: () => {},
});

export const FaucetPageContextProvider = ({
  children,
}: FaucetPageContextProps) => {
  const VIEWS = {
    ROOT: {
      path: '/',
      fullPath: '/faucet',
    },
    SELECT_CHAIN: {
      path: '/select-chain',
      fullPath: '/faucet/select-chain',
    },
  };

  const {
    address,
    provider,
    ethers,
    chain: selectedChain,
  } = useGrinderyNexus();
  const { tokenAbi } = useAbi();
  const [userAddress, setUserAddress] = useState<string | null>(address || '');
  const [amountGRT, setAmountGRT] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [trxHash, setTrxHash] = useState<string | null>('');
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState({ type: '', text: '' });
  const [chain, setChain] = useState(selectedChain || '');
  const { chains, isLoading: chainsIsLoading } = useGrinderyChains();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const currentChain: Chain | null =
    chain && chains.find((c) => c.value === chain)
      ? {
          id:
            chain && typeof chain === 'string'
              ? `0x${parseFloat(chain.split(':')[1]).toString(16)}`
              : '',
          value: chains.find((c) => c.value === chain)?.value || '',
          label: chains.find((c) => c.value === chain)?.label || '',
          icon: chains.find((c) => c.value === chain)?.icon || '',
          rpc: chains.find((c) => c.value === chain)?.rpc || [],
          nativeToken: chains.find((c) => c.value === chain)?.token || '',
        }
      : null;

  const handleGetClick = async () => {
    setTrxHash('');
    setErrorMessage({
      type: '',
      text: '',
    });
    if (!userAddress) {
      setErrorMessage({
        type: 'userAddress',
        text: 'Wallet address is required',
      });
      return;
    }
    if (!amountGRT) {
      setErrorMessage({
        type: 'amountGRT',
        text: 'Amount is required',
      });
      return;
    }
    if (!isNumeric(amountGRT)) {
      setErrorMessage({
        type: 'amountGRT',
        text: 'Must be a number',
      });
      return;
    }
    if (!chain) {
      setErrorMessage({
        type: 'chain',
        text: 'Blockchain is required',
      });
      return;
    }
    const signer = provider.getSigner();
    const _grtContract = new ethers.Contract(
      GRT_CONTRACT_ADDRESS[chain.toString()],
      tokenAbi,
      signer
    );
    const grtContract = _grtContract.connect(signer);
    const tx = await grtContract.mint(
      userAddress,
      ethers.utils.parseEther(amountGRT)
    );
    try {
      setLoading(true);
      await tx.wait();
      setLoading(false);
    } catch (e) {
      setError(true);
      setLoading(false);
    }

    setTrxHash(tx.hash);
  };

  useEffect(() => {
    if (address) {
      setUserAddress(address);
      setChain(selectedChain || '');
    }
  }, [address, selectedChain]);

  useEffect(() => {
    if (currentChain && currentChain.id) {
      window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: currentChain.id,
            chainName: currentChain.label,
            rpcUrls: currentChain.rpc,
            nativeCurrency: {
              name: currentChain.nativeToken,
              symbol: currentChain.nativeToken,
              decimals: 18,
            },
          },
        ],
      });
    }
  }, [currentChain]);

  useEffect(() => {
    setTrxHash('');
    setError(false);
  }, [selectedChain]);

  return (
    <FaucetPageContext.Provider
      value={{
        VIEWS,
        userAddress,
        amountGRT,
        loading,
        trxHash,
        error,
        errorMessage,
        chain,
        currentChain,
        setUserAddress,
        setAmountGRT,
        setErrorMessage,
        setChain,
        handleGetClick,
      }}
    >
      {children}
    </FaucetPageContext.Provider>
  );
};

export default FaucetPageContextProvider;
