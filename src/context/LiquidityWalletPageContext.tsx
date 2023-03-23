import React, { createContext, useEffect, useState } from 'react';
import { useGrinderyNexus } from 'use-grindery-nexus';
import { Chain } from '../types/Chain';
import { useNavigate } from 'react-router-dom';
import useGrinderyChains from '../hooks/useGrinderyChains';
import _ from 'lodash';
import { LiquidityWallet } from '../types/LiquidityWallet';
import { TokenType } from '../types/TokenType';
import useLiquidityWallets from '../hooks/useLiquidityWallets';
import {
  GRTSATELLITE_CONTRACT_ADDRESS,
  GRT_CONTRACT_ADDRESS,
} from '../constants';
import useAbi from '../hooks/useAbi';
import { getErrorMessage } from '../utils/error';

function isNumeric(value: string) {
  return /^\d*(\.\d+)?$/.test(value);
}

// Context props
type ContextProps = {
  amountAdd: string;
  loading: boolean;
  errorMessage: { type: string; text: string };
  chain: string;

  currentChain: Chain | null;
  wallets: LiquidityWallet[];
  token: string;
  chainTokens: TokenType[];
  searchToken: string;
  setAmountAdd: React.Dispatch<React.SetStateAction<string>>;
  setErrorMessage: React.Dispatch<
    React.SetStateAction<{ type: string; text: string }>
  >;
  setChain: React.Dispatch<React.SetStateAction<string>>;
  setSearchToken: React.Dispatch<React.SetStateAction<string>>;
  setToken: React.Dispatch<React.SetStateAction<string>>;
  handleCreateClick: () => void;
  handleAddClick: (id: string) => void;
  handleWithdrawClick: (id: string) => void;
  VIEWS: {
    [key: string]: {
      path: string;
      fullPath: string;
    };
  };
};

// Context provider props
type LiquidityWalletPageContextProps = {
  children: React.ReactNode;
};

// Init context
export const LiquidityWalletPageContext = createContext<ContextProps>({
  amountAdd: '',
  loading: false,
  errorMessage: { type: '', text: '' },
  chain: '',
  currentChain: null,
  wallets: [],
  token: '',
  chainTokens: [],
  searchToken: '',
  setAmountAdd: () => {},
  setErrorMessage: () => {},
  setChain: () => {},
  setSearchToken: () => {},
  setToken: () => {},
  handleCreateClick: () => {},
  handleAddClick: () => {},
  handleWithdrawClick: () => {},
  VIEWS: {},
});

export const LiquidityWalletPageContextProvider = ({
  children,
}: LiquidityWalletPageContextProps) => {
  const VIEWS = {
    ROOT: { path: '/', fullPath: '/sell/wallets' },
    CREATE: { path: '/create', fullPath: '/sell/wallets/create' },
    SELECT_CHAIN: {
      path: '/select-chain',
      fullPath: '/sell/wallets/select-chain',
    },
    ADD: {
      path: '/:walletId/tokens/add',
      fullPath: '/sell/wallets/:walletId/tokens/add',
    },
    WITHDRAW: {
      path: '/:walletId/tokens/withdraw',
      fullPath: '/sell/wallets/:walletId/tokens/withdraw',
    },
    TOKENS: {
      path: '/:walletId/tokens',
      fullPath: '/sell/wallets/:walletId/tokens',
    },
    SELECT_TOKEN: {
      path: '/:walletId/tokens/select-token',
      fullPath: '/sell/wallets/:walletId/tokens/select-token',
    },
  };

  const { chain: selectedChain, provider, ethers } = useGrinderyNexus();
  let navigate = useNavigate();
  const {
    wallets,
    setWallets,
    isLoading: walletsIsLoading,
    saveWallet,
    getWallet,
    updateWallet,
  } = useLiquidityWallets();
  const [amountAdd, setAmountAdd] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState({ type: '', text: '' });
  const [chain, setChain] = useState(selectedChain?.toString() || '');
  const { chains } = useGrinderyChains();
  const [searchToken, setSearchToken] = useState('');
  const { satelliteAbi, liquidityWalletAbi, tokenAbi } = useAbi();
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
          tokens: chains.find((c) => c.value === chain)?.tokens || [],
        }
      : null;

  const chainTokens = (
    (chain && chains.find((c) => c.value === chain)?.tokens) ||
    []
  ).filter(
    (t: any) => !searchToken || t.symbol.toLowerCase().includes(searchToken)
  );

  const handleCreateClick = async () => {
    setErrorMessage({
      type: '',
      text: '',
    });

    if (!chain) {
      setErrorMessage({
        type: 'chain',
        text: 'Blockchain is required',
      });
      return;
    }
    if (!satelliteAbi) {
      setErrorMessage({
        type: 'tx',
        text: 'Satellite ABI not found.',
      });
      return;
    }

    if (
      chain &&
      wallets
        .map((wallet: LiquidityWallet) => wallet.chainId)
        .includes(chain.split(':')[1])
    ) {
      setErrorMessage({
        type: 'chain',
        text: `You already have wallet for ${currentChain?.label} chain. Please, select another.`,
      });
      return;
    }

    setLoading(true);

    const signer = provider.getSigner();

    const _grtSatellite = new ethers.Contract(
      GRTSATELLITE_CONTRACT_ADDRESS[chain.toString()],
      satelliteAbi,
      signer
    );

    const grtSatellite = _grtSatellite.connect(signer);

    const tx = await grtSatellite
      .deployLiquidityContract()
      .catch((error: any) => {
        setErrorMessage({
          type: 'tx',
          text: getErrorMessage(error.error, 'Create wallet transaction error'),
        });
        console.error('create wallet error', error.error);
        setLoading(false);
        return;
      });

    if (!tx) {
      setLoading(false);
      return;
    }

    let receipt;
    try {
      receipt = await tx.wait();
    } catch (error: any) {
      setErrorMessage({
        type: 'tx',
        text: error?.message || 'Transaction error',
      });
      console.error('tx.wait error', error);
      setLoading(false);
      return;
    }

    const wallet = await saveWallet({
      chainId: chain.toString().split(':')[1],
      walletAddress: receipt.events[2].args[0],
    });

    if (!wallet) {
      setErrorMessage({
        type: 'tx',
        text: 'Transaction error',
      });
    }

    setTimeout(() => {
      setWallets([
        {
          //...wallet,
          _id:
            wallets.length > 0
              ? (parseFloat(wallets[wallets.length - 1]._id) + 1).toString()
              : '1',
          chainId: chain.toString().split(':')[1],
          tokens: {},
          new: true,
        },
        ...[...wallets],
      ]);
      setLoading(false);
      setErrorMessage({
        type: '',
        text: '',
      });
      navigate(VIEWS.ROOT.fullPath);
    }, 1500);
  };

  const handleWithdrawClick = async (id: string) => {
    setErrorMessage({
      type: '',
      text: '',
    });

    if (!amountAdd) {
      setErrorMessage({
        type: 'amountAdd',
        text: 'Amount is required',
      });
      return;
    }
    if (!isNumeric(amountAdd)) {
      setErrorMessage({
        type: 'amountAdd',
        text: 'Must be a number',
      });
      return;
    }
    if (
      parseFloat(amountAdd) >
      parseFloat(
        wallets.find((wallet: LiquidityWallet) => id === wallet._id)?.tokens?.[
          token
        ] || '0'
      )
    ) {
      setErrorMessage({
        type: 'amountAdd',
        text: `You can withdraw maximum ${
          wallets.find((wallet: LiquidityWallet) => id === wallet._id)
            ?.tokens?.[token] || '0'
        } tokens`,
      });
      return;
    }
    if (!liquidityWalletAbi) {
      setErrorMessage({
        type: 'tx',
        text: 'Contract ABI not found.',
      });

      return;
    }

    setLoading(true);

    const signer = provider.getSigner();
    const wallet = await getWallet(id);

    if (!wallet) {
      setErrorMessage({
        type: 'tx',
        text: 'Wallet not found.',
      });
      setLoading(false);
      return;
    }

    const _grtLiquidityWallet = new ethers.Contract(
      wallet.walletAddress,
      liquidityWalletAbi,
      signer
    );

    const grtLiquidityWallet = _grtLiquidityWallet.connect(signer);

    const txTransfer = await grtLiquidityWallet
      .withdrawNative(ethers.utils.parseEther(amountAdd))
      .catch((error: any) => {
        setErrorMessage({
          type: 'tx',
          text: getErrorMessage(error.error, 'Transfer transaction error'),
        });
        console.error('transfer error', error.error);
        setLoading(false);
        return;
      });

    if (!txTransfer) {
      setLoading(false);
      return;
    }

    try {
      await txTransfer.wait();
    } catch (error: any) {
      setErrorMessage({
        type: 'tx',
        text: error?.message || 'Transaction error',
      });
      console.error('txTransfer.wait error', error);
      setLoading(false);
      return;
    }

    const amountStored = wallet.tokens[token] || 0;

    const isUpdated = await updateWallet({
      walletAddress: wallet.walletAddress,
      chainId: chain.toString().split(':')[1],
      tokenId: token,
      amount: (Number(amountStored) - Number(amountAdd)).toString(),
    });

    if (!isUpdated) {
      setErrorMessage({
        type: 'tx',
        text: 'Transaction error',
      });
      return;
    }

    setTimeout(() => {
      setAmountAdd('');
      setToken('');
      setLoading(false);
      navigate(VIEWS.ROOT.fullPath);
    });
  };

  const handleAddClick = async (id: string) => {
    setErrorMessage({
      type: '',
      text: '',
    });
    if (!token) {
      setErrorMessage({
        type: 'token',
        text: 'Token is required',
      });
      return;
    }
    if (!amountAdd) {
      setErrorMessage({
        type: 'amountAdd',
        text: 'Amount is required',
      });
      return;
    }
    if (!isNumeric(amountAdd)) {
      setErrorMessage({
        type: 'amountAdd',
        text: 'Must be a number',
      });
      return;
    }

    setLoading(true);

    const signer = provider.getSigner();

    const wallet = await getWallet(id);

    if (!wallet) {
      setErrorMessage({
        type: 'tx',
        text: 'Wallet not found.',
      });
      setLoading(false);
      return;
    }

    const txTransfer = await signer
      .sendTransaction({
        to: wallet.walletAddress,
        value: ethers.utils.parseEther(amountAdd),
      })
      .catch((error: any) => {
        setErrorMessage({
          type: 'tx',
          text: getErrorMessage(error, 'Transfer transaction error'),
        });
        console.error('transfer error', error);
        setLoading(false);
        return;
      });

    if (!txTransfer) {
      setLoading(false);
      return;
    }
    try {
      await txTransfer.wait();
    } catch (error: any) {
      setErrorMessage({
        type: 'tx',
        text: error?.message || 'Transaction error',
      });
      console.error('txTransfer.wait error', error);
      setLoading(false);
      return;
    }

    const amountStored = wallet.tokens[token] || 0;
    const isUpdated = await updateWallet({
      walletAddress: wallet.walletAddress,
      chainId: chain.toString().split(':')[1],
      tokenId: token,
      amount: (Number(amountStored) + Number(amountAdd)).toString(),
    });
    if (!isUpdated) {
      setErrorMessage({
        type: 'tx',
        text: 'Transaction error',
      });
      return;
    }

    setLoading(false);
    setTimeout(() => {
      setAmountAdd('');
      setToken('');
      setLoading(false);
      navigate(VIEWS.ROOT.fullPath);
    });
  };

  useEffect(() => {
    setChain(selectedChain?.toString() || '');
  }, [selectedChain]);

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

  return (
    <LiquidityWalletPageContext.Provider
      value={{
        amountAdd,
        loading,
        errorMessage,
        chain,
        currentChain,
        wallets,
        token,
        searchToken,
        chainTokens,
        setSearchToken,
        setAmountAdd,
        setErrorMessage,
        setChain,
        setToken,
        handleCreateClick,
        handleAddClick,
        handleWithdrawClick,
        VIEWS,
      }}
    >
      {children}
    </LiquidityWalletPageContext.Provider>
  );
};

export default LiquidityWalletPageContextProvider;
