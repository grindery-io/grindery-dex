import React, { createContext, useEffect, useState } from 'react';
import { useGrinderyNexus } from 'use-grindery-nexus';
import { ChainType } from '../types/ChainType';
import { useNavigate } from 'react-router-dom';
import _ from 'lodash';
import { LiquidityWalletType } from '../types/LiquidityWalletType';
import { TokenType } from '../types/TokenType';
import useLiquidityWallets from '../hooks/useLiquidityWallets';
import { GRTSATELLITE_CONTRACT_ADDRESS } from '../config/constants';
import { getErrorMessage } from '../utils/error';
import { useAppSelector } from '../store/storeHooks';
import { selectChainsItems } from '../store/slices/chainsSlice';
import isNumeric from '../utils/isNumeric';
import {
  selectLiquidityWalletAbi,
  selectSatelliteAbi,
} from '../store/slices/abiSlice';

// Context props
type ContextProps = {
  amountAdd: string;
  loading: boolean;
  errorMessage: { type: string; text: string };
  chain: string;

  currentChain: ChainType | null;
  wallets: LiquidityWalletType[];
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
  const { wallets, setWallets, saveWallet, getWallet, updateWallet } =
    useLiquidityWallets();
  const [amountAdd, setAmountAdd] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState({ type: '', text: '' });
  const [chain, setChain] = useState(selectedChain?.toString() || '');
  const chains = useAppSelector(selectChainsItems);
  const [searchToken, setSearchToken] = useState('');
  const satelliteAbi = useAppSelector(selectSatelliteAbi);
  const liquidityWalletAbi = useAppSelector(selectLiquidityWalletAbi);
  const filteredChain = chains.find((c) => c.value === chain);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const currentChain: ChainType | null =
    chain && filteredChain
      ? {
          ...(filteredChain || {}),
          idHex:
            chain && typeof chain === 'string'
              ? `0x${parseFloat(chain.split(':')[1]).toString(16)}`
              : '',
          value: filteredChain?.value || '',
          label: filteredChain?.label || '',
          icon: filteredChain?.icon || '',
          rpc: filteredChain?.rpc || [],
          nativeToken: filteredChain?.token || '',
          tokens: filteredChain?.tokens || [],
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
        .map((wallet: LiquidityWalletType) => wallet.chainId)
        .includes(chain.split(':')[1])
    ) {
      setErrorMessage({
        type: 'chain',
        text: `You already have wallet for ${currentChain?.label} chain. Please, select another.`,
      });
      return;
    }

    setLoading(true);
    if (currentChain && currentChain?.value !== selectedChain) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [
            {
              chainId: currentChain.idHex,
            },
          ],
        });
      } catch (error: any) {
        // TODO: handle chain switching error
        setLoading(false);
        return;
      }
    }

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
      return;
    }

    if (typeof wallet !== 'boolean') {
      setWallets([
        {
          ...wallet,
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
    }
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
        wallets.find((wallet: LiquidityWalletType) => id === wallet._id)
          ?.tokens?.[token] || '0'
      )
    ) {
      setErrorMessage({
        type: 'amountAdd',
        text: `You can withdraw maximum ${
          wallets.find((wallet: LiquidityWalletType) => id === wallet._id)
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

    if (currentChain && currentChain?.value !== selectedChain) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [
            {
              chainId: currentChain.idHex,
            },
          ],
        });
      } catch (error: any) {
        // TODO: handle chain switching error
        setLoading(false);
        return;
      }
    }

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

    const nativeToken = currentChain?.tokens?.find((t: any) => {
      return t.address === '0x0';
    });

    const selectedToken = currentChain?.tokens?.find((t: any) => {
      return t.symbol === token;
    });

    const grtLiquidityWallet = _grtLiquidityWallet.connect(signer);

    let txTransfer;
    try {
      txTransfer =
        nativeToken?.symbol === token
          ? await grtLiquidityWallet.withdrawNative(
              ethers.utils.parseEther(amountAdd)
            )
          : await grtLiquidityWallet.withdrawERC20(
              selectedToken?.address,
              ethers.utils.parseEther(amountAdd)
            );
    } catch (error: any) {
      setErrorMessage({
        type: 'tx',
        text: getErrorMessage(error.error, 'Transfer transaction error'),
      });
      console.error('transfer error', error.error);
      setLoading(false);
      return;
    }

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

    setAmountAdd('');
    setToken('');
    setLoading(false);
    navigate(VIEWS.ROOT.fullPath);
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

    if (currentChain && currentChain?.value !== selectedChain) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [
            {
              chainId: currentChain.idHex,
            },
          ],
        });
      } catch (error: any) {
        // TODO: handle chain switching error
        setLoading(false);
        return;
      }
    }

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
    setAmountAdd('');
    setToken('');
    setLoading(false);
    navigate(VIEWS.ROOT.fullPath);
  };

  useEffect(() => {
    setChain(selectedChain?.toString() || '');
  }, [selectedChain]);

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
