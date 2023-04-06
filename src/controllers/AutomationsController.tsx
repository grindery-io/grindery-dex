import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import { useAppDispatch, useAppSelector } from '../store/storeHooks';
import {
  selectUserAccessToken,
  selectUserChainId,
} from '../store/slices/userSlice';
import { getChainIdHex } from '../utils/helpers/chainHelpers';
import { useUserController } from './UserController';
import { getErrorMessage } from '../utils/error';
import {
  AutomationsInput,
  AutomationsInputFieldName,
  clearAutomationsError,
  selectAutomationsInput,
  setAutomationsBotAddress,
  setAutomationsError,
  setAutomationsInputValue,
  setAutomationsLoading,
} from '../store/slices/automationsSlice';
import { getBotAddress } from '../services/automationServices';
import useLiquidityWallets from '../hooks/useLiquidityWallets';
import { selectLiquidityWalletAbi } from '../store/slices/abiSlice';
import { LiquidityWalletType } from '../types/LiquidityWalletType';

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
    liquidityWalletAbi: any
  ) => void;
};

export const AutomationsContext = createContext<ContextProps>({
  handleAutomationsInputChange: () => {},
  handleAutomationsDelegateAction: () => {},
});

type AutomationsControllerProps = {
  children: React.ReactNode;
};

export const AutomationsController = ({
  children,
}: AutomationsControllerProps) => {
  const accessToken = useAppSelector(selectUserAccessToken);
  const userChainId = useAppSelector(selectUserChainId);
  const dispatch = useAppDispatch();
  const input = useAppSelector(selectAutomationsInput);
  const { chainId } = input;
  const { wallets } = useLiquidityWallets();
  const liquidityWalletAbi = useAppSelector(selectLiquidityWalletAbi);
  const wallet = wallets.find(
    (w: LiquidityWalletType) => w.chainId === chainId
  );
  const { getSigner, getEthers } = useUserController();

  const fetchBotAddress = useCallback(
    async (accessToken: string, chainId: string): Promise<string> => {
      dispatch(setAutomationsLoading(true));
      const botAddress = await getBotAddress(accessToken, chainId);
      const result = botAddress || '';
      dispatch(setAutomationsBotAddress(result));
      dispatch(setAutomationsLoading(false));
      return result;
    },
    [dispatch]
  );

  const handleAutomationsInputChange = useCallback(
    (name: AutomationsInputFieldName, value: string) => {
      dispatch(clearAutomationsError());
      dispatch(setAutomationsInputValue({ name, value }));
    },
    [dispatch]
  );

  const handleAutomationsCheckDelegationAction = useCallback(
    async (
      accessToken: string,
      walletAddress: string,
      chainId: string,
      userChainId: string,
      liquidityWalletAbi: any
    ) => {
      if (!walletAddress) {
        return;
      }
      dispatch(clearAutomationsError());
      if (userChainId !== chainId) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [
              {
                chainId: `0x${parseFloat(chainId).toString(16)}`,
              },
            ],
          });
        } catch (error: any) {
          // handle change switching error
          dispatch(
            setAutomationsError({
              type: 'setBot',
              text: "Chain hasn't been switched. Please, open MetaMask extension and switch chain to BSC Testnet manually.",
            })
          );
        }
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
          setAutomationsError({
            type: 'setBot',
            text: getErrorMessage(error, 'Get wallet bot failed'),
          })
        );
        console.error('getBot error', error);
        return;
      });

      const botAddress = await fetchBotAddress(accessToken, chainId);

      dispatch(setAutomationsBotAddress(_bot || ''));
      dispatch(
        setAutomationsInputValue({
          name: 'bot',
          value: botAddress || _bot || '',
        })
      );
      dispatch(setAutomationsLoading(false));
    },
    [dispatch, fetchBotAddress, getEthers, getSigner]
  );

  const validateAutomationsDelegateAction = (input: AutomationsInput) => {
    if (!input.chainId) {
      dispatch(
        setAutomationsError({
          type: 'chain',
          text: 'Blockchain is required',
        })
      );
      return false;
    }
    if (!input.bot) {
      dispatch(
        setAutomationsError({
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
    liquidityWalletAbi: any
  ) => {
    // clear error message
    dispatch(clearAutomationsError());

    // validate before executing
    if (!validateAutomationsDelegateAction(input)) {
      return;
    }

    // start executing
    dispatch(setAutomationsLoading(true));

    if (input.chainId !== userChainId || !userChainId) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [
            {
              chainId: getChainIdHex(input.chainId),
            },
          ],
        });
      } catch (error: any) {
        dispatch(setAutomationsLoading(false));
        return;
      }
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
        setAutomationsError({
          type: 'setBot',
          text: getErrorMessage(error, 'Transaction error'),
        })
      );
      console.error('setBot error', error);
      dispatch(setAutomationsLoading(false));
      return;
    });

    if (!tx) {
      dispatch(setAutomationsLoading(false));
      return;
    }

    try {
      await tx.wait();
    } catch (error: any) {
      dispatch(
        setAutomationsError({
          type: 'setbot',
          text: error?.message || 'Transaction error',
        })
      );
      console.error('tx.wait error', error);
      dispatch(setAutomationsLoading(false));
      return;
    }

    setTimeout(() => {
      handleAutomationsCheckDelegationAction(
        accessToken,
        walletAddress,
        input.chainId,
        userChainId,
        liquidityWalletAbi
      );
    }, 1000);
  };

  useEffect(() => {
    if (
      accessToken &&
      wallet?.walletAddress &&
      chainId &&
      userChainId &&
      liquidityWalletAbi
    ) {
      handleAutomationsCheckDelegationAction(
        accessToken,
        wallet?.walletAddress,
        chainId,
        userChainId,
        liquidityWalletAbi
      );
    }
  }, [
    accessToken,
    wallet?.walletAddress,
    chainId,
    userChainId,
    liquidityWalletAbi,
    handleAutomationsCheckDelegationAction,
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

export const useAutomationsController = () => useContext(AutomationsContext);

export default AutomationsController;
