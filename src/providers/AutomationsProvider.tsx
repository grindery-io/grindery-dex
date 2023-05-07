import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import {
  useAppDispatch,
  useAppSelector,
  AutomationsInput,
  AutomationsInputFieldName,
  selectAbiStore,
  selectAutomationsStore,
  automationsStoreActions,
  selectChainsStore,
  selectWalletsStore,
  selectUserStore,
} from '../store';
import { getChainById, getErrorMessage, switchMetamaskNetwork } from '../utils';
import { useUserProvider } from './UserProvider';
import { getBotAddress } from '../services';
import { ChainType, LiquidityWalletType } from '../types';

// Context props
type ContextProps = {
  handleAutomationsInputChange: (
    name: AutomationsInputFieldName,
    value: string
  ) => void;
  handleAutomationsDelegateAction: (
    accessToken: string,
    input: AutomationsInput,
    userChainId: string,
    walletAddress: string,
    liquidityWalletAbi: any,
    chains: ChainType[]
  ) => void;
};

export const AutomationsContext = createContext<ContextProps>({
  handleAutomationsInputChange: () => {},
  handleAutomationsDelegateAction: () => {},
});

type AutomationsProviderProps = {
  children: React.ReactNode;
};

export const AutomationsProvider = ({ children }: AutomationsProviderProps) => {
  const dispatch = useAppDispatch();
  const { accessToken, chainId: userChainId } = useAppSelector(selectUserStore);
  const { input } = useAppSelector(selectAutomationsStore);
  const { chainId } = input;
  const { items: chains } = useAppSelector(selectChainsStore);
  const { items: wallets } = useAppSelector(selectWalletsStore);
  const { liquidityWalletAbi } = useAppSelector(selectAbiStore);
  const wallet = wallets.find(
    (w: LiquidityWalletType) => w.chainId === chainId
  );
  const { getSigner, getEthers } = useUserProvider();

  const fetchBotAddress = useCallback(
    async (accessToken: string, chainId: string): Promise<string> => {
      dispatch(automationsStoreActions.setLoading(true));
      const botAddress = await getBotAddress(accessToken, chainId);
      const result = botAddress || '';
      dispatch(automationsStoreActions.setBotAddress(result));
      dispatch(automationsStoreActions.setLoading(false));
      return result;
    },
    [dispatch]
  );

  const handleAutomationsInputChange = useCallback(
    (name: AutomationsInputFieldName, value: string) => {
      dispatch(automationsStoreActions.clearError());
      dispatch(automationsStoreActions.setInputValue({ name, value }));
    },
    [dispatch]
  );

  const handleAutomationsCheckDelegationAction = useCallback(
    async (
      accessToken: string,
      walletAddress: string,
      chainId: string,
      userChainId: string,
      liquidityWalletAbi: any,
      chains: ChainType[]
    ) => {
      if (!walletAddress) {
        return;
      }
      dispatch(automationsStoreActions.clearError());

      const chain = getChainById(chainId, chains);
      if (!chain) {
        dispatch(
          automationsStoreActions.setError({
            type: 'setBot',
            text: 'Chain not found',
          })
        );
        dispatch(automationsStoreActions.setLoading(false));
        return;
      }
      const networkSwitched = await switchMetamaskNetwork(userChainId, chain);
      if (!networkSwitched) {
        dispatch(
          automationsStoreActions.setError({
            type: 'setBot',
            text: 'Network switching failed. Please, switch network in your MetaMask and try again.',
          })
        );
        dispatch(automationsStoreActions.setLoading(false));
        return;
      }

      const ethers = getEthers();
      const signer = getSigner();

      // set wallet contract
      const _walletContract = new ethers.Contract(
        walletAddress,
        liquidityWalletAbi,
        signer
      );

      // connect signer
      const walletContract = _walletContract.connect(signer);

      // get wallet bot
      const _bot = await walletContract.getBot().catch((error: any) => {
        dispatch(
          automationsStoreActions.setError({
            type: 'setBot',
            text: getErrorMessage(error, 'Get wallet bot failed'),
          })
        );
        console.error('getBot error', error);
        return;
      });

      const botAddress = await fetchBotAddress(accessToken, chainId);

      dispatch(automationsStoreActions.setBotAddress(_bot || ''));
      dispatch(
        automationsStoreActions.setInputValue({
          name: 'bot',
          value: botAddress || _bot || '',
        })
      );
      dispatch(automationsStoreActions.setLoading(false));
    },
    [dispatch, fetchBotAddress, getEthers, getSigner]
  );

  const validateAutomationsDelegateAction = (input: AutomationsInput) => {
    if (!input.chainId) {
      dispatch(
        automationsStoreActions.setError({
          type: 'chain',
          text: 'Blockchain is required',
        })
      );
      return false;
    }
    if (!input.bot) {
      dispatch(
        automationsStoreActions.setError({
          type: 'bot',
          text: 'Bot address is required',
        })
      );
      return false;
    }

    return true;
  };

  const handleAutomationsDelegateAction = async (
    accessToken: string,
    input: AutomationsInput,
    userChainId: string,
    walletAddress: string,
    liquidityWalletAbi: any,
    chains: ChainType[]
  ) => {
    // clear error message
    dispatch(automationsStoreActions.clearError());

    // validate before executing
    if (!validateAutomationsDelegateAction(input)) {
      return;
    }

    // start executing
    dispatch(automationsStoreActions.setLoading(true));

    const inputChain = getChainById(input.chainId, chains);
    if (!inputChain) {
      dispatch(
        automationsStoreActions.setError({
          type: 'setBot',
          text: 'Chain not found',
        })
      );
      dispatch(automationsStoreActions.setLoading(false));
      return;
    }
    const networkSwitched = await switchMetamaskNetwork(
      userChainId,
      inputChain
    );
    if (!networkSwitched) {
      dispatch(
        automationsStoreActions.setError({
          type: 'setBot',
          text: 'Network switching failed. Please, switch network in your MetaMask and try again.',
        })
      );
      dispatch(automationsStoreActions.setLoading(false));
      return;
    }

    const ethers = getEthers();
    const signer = getSigner();

    // set wallet contract
    const _walletContract = new ethers.Contract(
      walletAddress,
      liquidityWalletAbi,
      signer
    );

    // connect signer
    const walletContract = _walletContract.connect(signer);

    // set wallet bot
    const tx = await walletContract.setBot(input.bot).catch((error: any) => {
      dispatch(
        automationsStoreActions.setError({
          type: 'setBot',
          text: getErrorMessage(error, 'Transaction error'),
        })
      );
      console.error('setBot error', error);
      dispatch(automationsStoreActions.setLoading(false));
      return;
    });

    if (!tx) {
      dispatch(automationsStoreActions.setLoading(false));
      return;
    }

    try {
      await tx.wait();
    } catch (error: any) {
      dispatch(
        automationsStoreActions.setError({
          type: 'setbot',
          text: error?.message || 'Transaction error',
        })
      );
      console.error('tx.wait error', error);
      dispatch(automationsStoreActions.setLoading(false));
      return;
    }

    setTimeout(() => {
      handleAutomationsCheckDelegationAction(
        accessToken,
        walletAddress,
        input.chainId,
        userChainId,
        liquidityWalletAbi,
        chains
      );
    }, 1000);
  };

  useEffect(() => {
    if (
      accessToken &&
      wallet?.walletAddress &&
      chainId &&
      userChainId &&
      liquidityWalletAbi &&
      chains
    ) {
      handleAutomationsCheckDelegationAction(
        accessToken,
        wallet?.walletAddress,
        chainId,
        userChainId,
        liquidityWalletAbi,
        chains
      );
    }
  }, [
    accessToken,
    wallet?.walletAddress,
    chainId,
    userChainId,
    liquidityWalletAbi,
    handleAutomationsCheckDelegationAction,
    chains,
  ]);

  return (
    <AutomationsContext.Provider
      value={{
        handleAutomationsInputChange,
        handleAutomationsDelegateAction,
      }}
    >
      {children}
    </AutomationsContext.Provider>
  );
};

export const useAutomationsProvider = () => useContext(AutomationsContext);

export default AutomationsProvider;
