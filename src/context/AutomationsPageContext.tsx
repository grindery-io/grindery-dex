import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import { useGrinderyNexus } from 'use-grindery-nexus';
import { DELIGHT_API_URL } from '../config/constants';
import useAbi from '../hooks/useAbi';
import useLiquidityWallets from '../hooks/useLiquidityWallets';
import { Chain } from '../types/Chain';
import { LiquidityWallet } from '../types/LiquidityWallet';
import { getErrorMessage } from '../utils/error';
import { useAppSelector } from '../store/storeHooks';
import {
  selectChainsItems,
  selectChainsLoading,
} from '../store/slices/chainsSlice';

// Context props
type ContextProps = {
  VIEWS: {
    [key: string]: {
      path: string;
      fullPath: string;
    };
  };
  chain: Chain | null;
  bot: string;
  currentBot: string;
  loading: boolean;
  errorMessage: { type: string; text: string };
  handleBotChange: (bot: string) => void;
  handleChainChange: (_chain: Chain) => void;
  handleDelegateClick: () => void;
};

// Context provider props
type AutomationsPageContextProps = {
  children: React.ReactNode;
};

// Init context
export const AutomationsPageContext = createContext<ContextProps>({
  VIEWS: {},
  chain: null,
  bot: '',
  loading: false,
  currentBot: '',
  errorMessage: { type: '', text: '' },
  handleBotChange: () => {},
  handleChainChange: () => {},
  handleDelegateClick: () => {},
});

export const AutomationsPageContextProvider = ({
  children,
}: AutomationsPageContextProps) => {
  const VIEWS = {
    ROOT: { path: '', fullPath: '/sell/automations' },
    SELECT_CHAIN: {
      path: '/select-chain',
      fullPath: '/sell/automations/select-chain',
    },
  };
  const {
    chain: selectedChain,
    ethers,
    provider,
    token,
    address,
  } = useGrinderyNexus();
  const [chain, setChain] = useState<Chain | null>(null);
  const chains = useAppSelector(selectChainsItems);
  const chainsIsLoading = useAppSelector(selectChainsLoading);
  const [loading, setLoading] = useState(false);
  const [bot, setBot] = useState<string>('');
  const [currentBot, setCurrentBot] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState({ type: '', text: '' });
  const { wallets } = useLiquidityWallets();
  const { liquidityWalletAbi } = useAbi();
  const wallet = wallets.find(
    (w: LiquidityWallet) => w.chainId === chain?.chainId
  );

  const params = {
    headers: {
      Authorization: `Bearer ${token?.access_token || ''}`,
    },
  };

  const handleChainChange = (_chain: Chain) => {
    setChain(_chain);
  };

  const handleBotChange = (_bot: string) => {
    setBot(_bot);
  };

  const checkDelegationState = async () => {
    if (!wallet) {
      return;
    }

    if (selectedChain !== 'eip155:97') {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [
            {
              chainId: `0x${parseFloat('97').toString(16)}`,
            },
          ],
        });
      } catch (error: any) {
        // handle change switching error
      }
    }

    // get signer
    const signer = provider.getSigner();

    // set wallet contract
    const _walletContract = new ethers.Contract(
      wallet?.walletAddress,
      liquidityWalletAbi,
      signer
    );

    // connect signer
    const walletContract = _walletContract.connect(signer);

    // get wallet bot
    const _bot = await walletContract.getBot().catch((error: any) => {
      setErrorMessage({
        type: 'saveOffer',
        text: getErrorMessage(error, 'Get wallet bot failed'),
      });
      console.error('getBot error', error);

      return;
    });

    const botRes = await axios
      .get(
        `${DELIGHT_API_URL}/view-blockchains/drone-address?chainId=${chain?.chainId}`,
        params
      )
      .catch((error: any) => {
        setErrorMessage({
          type: 'setBot',
          text: getErrorMessage(error, 'Server error'),
        });
        setLoading(false);
        return;
      });
    setCurrentBot(_bot || '');
    setBot(botRes?.data || _bot || '');
    setLoading(false);
  };

  const handleDelegateClick = async () => {
    setErrorMessage({
      type: '',
      text: '',
    });
    if (!wallet || !chain) {
      return;
    }
    if (!bot) {
      setErrorMessage({
        type: 'bot',
        text: 'Bot address is required',
      });
      return;
    }
    setLoading(true);

    if (selectedChain !== 'eip155:97') {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [
            {
              chainId: `0x${parseFloat('97').toString(16)}`,
            },
          ],
        });
      } catch (error: any) {
        setErrorMessage({
          type: 'setBot',
          text: 'Chain switching failed',
        });
        setLoading(false);
        return;
      }
    }

    // get signer
    const signer = provider.getSigner();

    // set wallet contract
    const _walletContract = new ethers.Contract(
      wallet?.walletAddress,
      liquidityWalletAbi,
      signer
    );

    // connect signer
    const walletContract = _walletContract.connect(signer);

    // set wallet bot
    const tx = await walletContract.setBot(bot).catch((error: any) => {
      setErrorMessage({
        type: 'setBot',
        text: getErrorMessage(error, 'Transaction error'),
      });
      console.error('setBot error', error);
      return;
    });

    if (!tx) {
      setLoading(false);
      return;
    }

    try {
      await tx.wait();
    } catch (error: any) {
      setErrorMessage({
        type: 'setbot',
        text: error?.message || 'Transaction error',
      });
      console.error('tx.wait error', error);
      setLoading(false);
      return;
    }

    checkDelegationState();
  };

  useEffect(() => {
    if (!chainsIsLoading) {
      setChain(chains.find((c: Chain) => c.chainId === '97') || null);
    }
  }, [chains, chainsIsLoading]);

  useEffect(() => {
    if (wallet) {
      checkDelegationState();
    }
  }, [wallet]);

  return (
    <AutomationsPageContext.Provider
      value={{
        VIEWS,
        chain,
        bot,
        loading,
        errorMessage,
        currentBot,
        handleBotChange,
        handleChainChange,
        handleDelegateClick,
      }}
    >
      {children}
    </AutomationsPageContext.Provider>
  );
};

export default AutomationsPageContextProvider;
