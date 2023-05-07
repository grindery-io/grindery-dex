import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useAppDispatch,
  useAppSelector,
  WalletsAddTokensInput,
  WalletsAddTokensInputFieldName,
  WalletsCreateInput,
  WalletsCreateInputFieldName,
  WalletsWithdrawTokensInput,
  WalletsWithdrawTokensInputFieldName,
  walletsStoreActions,
  selectUserStore,
} from '../store';
import {
  addWalletRequest,
  getWalletsRequest,
  getWalletRequest,
  updateWalletRequest,
} from '../services';
import { ErrorMessageType, LiquidityWalletType, TokenType } from '../types';
import {
  getChainIdHex,
  getErrorMessage,
  getWalletAddressFromReceipt,
  isNumeric,
} from '../utils';
import { useUserProvider } from './UserProvider';
import { ROUTES, GRTSATELLITE_CONTRACT_ADDRESS } from '../config';

// Context props
type ContextProps = {
  handleWalletsCreateAction: (
    accessToken: string,
    input: WalletsCreateInput,
    wallets: LiquidityWalletType[],
    userChainId: string,
    satelliteAbi: any
  ) => void;
  handleAddTokensAction: (
    accessToken: string,
    input: WalletsAddTokensInput,
    userChainId: string,
    wallet: LiquidityWalletType | null,
    token: TokenType | null
  ) => void;
  handleWithdrawTokensAction: (
    accessToken: string,
    input: WalletsWithdrawTokensInput,
    userChainId: string,
    wallet: LiquidityWalletType | null,
    token: TokenType | null,
    liquidityWalletAbi: any
  ) => void;
  handleWalletsCreateInputChange: (
    name: WalletsCreateInputFieldName,
    value: string
  ) => void;
  handleWalletsAddtokensInputChange: (
    name: WalletsAddTokensInputFieldName,
    value: string
  ) => void;

  handleWalletsWithdrawtokensInputChange: (
    name: WalletsWithdrawTokensInputFieldName,
    value: string
  ) => void;
};

export const WalletsContext = createContext<ContextProps>({
  handleWalletsCreateAction: () => {},
  handleAddTokensAction: () => {},
  handleWithdrawTokensAction: () => {},
  handleWalletsCreateInputChange: () => {},
  handleWalletsAddtokensInputChange: () => {},
  handleWalletsWithdrawtokensInputChange: () => {},
});

type WalletsProviderProps = {
  children: React.ReactNode;
};

export const WalletsProvider = ({ children }: WalletsProviderProps) => {
  let navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector(selectUserStore);
  const { getSigner, getEthers } = useUserProvider();

  const fetchWallets = useCallback(
    async (accessToken: string) => {
      dispatch(walletsStoreActions.setLoading(true));
      const wallets = await getWalletsRequest(accessToken);
      dispatch(walletsStoreActions.setItems(wallets || []));
      dispatch(walletsStoreActions.setLoading(false));
    },
    [dispatch]
  );

  const handleWalletsCreateInputChange = (
    name: WalletsCreateInputFieldName,
    value: string
  ) => {
    dispatch(walletsStoreActions.clearError());
    dispatch(walletsStoreActions.setCreateInputValue({ name, value }));
  };

  const handleWalletsAddtokensInputChange = useCallback(
    (name: WalletsAddTokensInputFieldName, value: string) => {
      dispatch(walletsStoreActions.clearError());
      dispatch(walletsStoreActions.setAddTokensInputValue({ name, value }));
    },
    [dispatch]
  );

  const handleWalletsWithdrawtokensInputChange = (
    name: WalletsWithdrawTokensInputFieldName,
    value: string
  ) => {
    dispatch(walletsStoreActions.clearError());
    dispatch(walletsStoreActions.setWithdrawTokensInputValue({ name, value }));
  };

  const validateWalletsCreateAction = (
    input: WalletsCreateInput
  ): true | ErrorMessageType => {
    if (!input.chainId) {
      return {
        type: 'chain',
        text: 'Blockchain is required',
      };
    }
    return true;
  };

  const handleWalletsCreateAction = async (
    accessToken: string,
    input: WalletsCreateInput,
    wallets: LiquidityWalletType[],
    userChainId: string,
    satelliteAbi: any
  ) => {
    dispatch(walletsStoreActions.clearError());

    const validate = validateWalletsCreateAction(input);
    if (validate !== true) {
      dispatch(walletsStoreActions.setError(validate));
      return;
    }

    if (!satelliteAbi) {
      dispatch(
        walletsStoreActions.setError({
          type: 'createWallet',
          text: 'Satellite ABI not found.',
        })
      );
      return;
    }

    if (
      input.chainId &&
      wallets
        .map((wallet: LiquidityWalletType) => wallet.chainId)
        .includes(input.chainId)
    ) {
      dispatch(
        walletsStoreActions.setError({
          type: 'chain',
          text: `You already have wallet for this chain. Please, select another.`,
        })
      );
      return;
    }

    dispatch(walletsStoreActions.setLoading(true));

    if (!userChainId || userChainId !== input.chainId) {
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
        dispatch(
          walletsStoreActions.setError({
            type: 'createWallet',
            text: `Chain switching failed`,
          })
        );
        dispatch(walletsStoreActions.setLoading(false));
        return;
      }
    }

    const signer = getSigner();
    const ethers = getEthers();

    const _grtSatellite = new ethers.Contract(
      GRTSATELLITE_CONTRACT_ADDRESS[`eip155:${input.chainId}`],
      satelliteAbi,
      signer
    );

    const grtSatellite = _grtSatellite.connect(signer);

    const tx = await grtSatellite
      .deployLiquidityContract()
      .catch((error: any) => {
        dispatch(
          walletsStoreActions.setError({
            type: 'createWallet',
            text: getErrorMessage(
              error.error,
              'Create wallet transaction error'
            ),
          })
        );
        console.error('create wallet error', error.error);
        dispatch(walletsStoreActions.setLoading(false));
        return;
      });

    if (!tx) {
      dispatch(
        walletsStoreActions.setError({
          type: 'createWallet',
          text: 'Create wallet transaction failed',
        })
      );
      dispatch(walletsStoreActions.setLoading(false));
      return;
    }

    let receipt;
    try {
      receipt = await tx.wait();
    } catch (error: any) {
      dispatch(
        walletsStoreActions.setError({
          type: 'createWallet',
          text: error?.message || 'Transaction error',
        })
      );
      console.error('tx.wait error', error);
      dispatch(walletsStoreActions.setLoading(false));
      return;
    }

    const walletAddress = getWalletAddressFromReceipt(receipt);

    const createdWalletId = await addWalletRequest(accessToken, {
      chainId: input.chainId,
      walletAddress: walletAddress,
    });

    if (!createdWalletId) {
      dispatch(
        walletsStoreActions.setError({
          type: 'createWallet',
          text: 'Wallet saving error',
        })
      );
      dispatch(walletsStoreActions.setLoading(false));
      return;
    }

    const wallet = await getWalletRequest(accessToken, createdWalletId).catch(
      () => {
        dispatch(
          walletsStoreActions.setError({
            type: 'createWallet',
            text: 'Wallet saving error',
          })
        );
        dispatch(walletsStoreActions.setLoading(false));
      }
    );

    if (!wallet) {
      return;
    }

    dispatch(
      walletsStoreActions.setItems([
        {
          ...wallet,
          new: true,
        },
        ...[...wallets],
      ])
    );
    dispatch(walletsStoreActions.setLoading(false));
    dispatch(walletsStoreActions.clearError());
    dispatch(walletsStoreActions.clearCreateInput());
    navigate(ROUTES.SELL.WALLETS.ROOT.FULL_PATH);
  };

  const validateAddTokensAction = (
    input: WalletsAddTokensInput
  ): true | ErrorMessageType => {
    if (!input.tokenId) {
      return {
        type: 'token',
        text: 'Token is required',
      };
    }
    if (!input.amount) {
      return {
        type: 'amount',
        text: 'Amount is required',
      };
    }
    if (!isNumeric(input.amount)) {
      return {
        type: 'amount',
        text: 'Must be a number',
      };
    }
    return true;
  };

  const handleAddTokensAction = async (
    accessToken: string,
    input: WalletsAddTokensInput,
    userChainId: string,
    wallet: LiquidityWalletType | null,
    token: TokenType | null
  ) => {
    dispatch(walletsStoreActions.clearError());

    const validate = validateAddTokensAction(input);

    if (validate !== true) {
      dispatch(walletsStoreActions.setError(validate));
      return;
    }

    if (!wallet) {
      dispatch(
        walletsStoreActions.setError({
          type: 'addTokens',
          text: 'Wallet not found.',
        })
      );
      return;
    }

    if (!token) {
      dispatch(
        walletsStoreActions.setError({
          type: 'addTokens',
          text: 'Token not found.',
        })
      );
      return;
    }

    dispatch(walletsStoreActions.setLoading(true));

    if (!userChainId || userChainId !== wallet.chainId) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [
            {
              chainId: getChainIdHex(wallet.chainId),
            },
          ],
        });
      } catch (error: any) {
        dispatch(
          walletsStoreActions.setError({
            type: 'addTokens',
            text: 'Chain switching failed.',
          })
        );
        dispatch(walletsStoreActions.setLoading(false));
        return;
      }
    }

    const signer = getSigner();
    const ethers = getEthers();

    const txTransfer = await signer
      .sendTransaction({
        to: wallet.walletAddress,
        value: ethers.utils.parseEther(input.amount),
      })
      .catch((error: any) => {
        dispatch(
          walletsStoreActions.setError({
            type: 'addTokens',
            text: getErrorMessage(error, 'Transfer transaction error'),
          })
        );
        console.error('transfer error', error);
        dispatch(walletsStoreActions.setLoading(false));
        return;
      });

    if (!txTransfer) {
      dispatch(
        walletsStoreActions.setError({
          type: 'addTokens',
          text: 'Transfer transaction failed',
        })
      );
      dispatch(walletsStoreActions.setLoading(false));
      return;
    }
    try {
      await txTransfer.wait();
    } catch (error: any) {
      dispatch(
        walletsStoreActions.setError({
          type: 'addTokens',
          text: error?.message || 'Transaction error',
        })
      );
      console.error('txTransfer.wait error', error);
      dispatch(walletsStoreActions.setLoading(false));
      return;
    }

    const amountStored = wallet.tokens[token.symbol] || 0;
    const isUpdated = await updateWalletRequest(accessToken, {
      walletAddress: wallet.walletAddress,
      chainId: wallet.chainId,
      tokenId: token.symbol,
      amount: (Number(amountStored) + Number(input.amount)).toString(),
    });
    if (!isUpdated) {
      dispatch(
        walletsStoreActions.setError({
          type: 'addTokens',
          text: 'Transaction error',
        })
      );
      dispatch(walletsStoreActions.setLoading(false));
      return;
    }

    dispatch(walletsStoreActions.setLoading(false));
    dispatch(walletsStoreActions.clearAddTokensInput());
    navigate(ROUTES.SELL.WALLETS.ROOT.FULL_PATH);
  };

  const validateWithdrawTokensAction = (
    input: WalletsWithdrawTokensInput,
    wallet: LiquidityWalletType | null,
    token: TokenType | null
  ): true | ErrorMessageType => {
    if (!input.amount) {
      return {
        type: 'amount',
        text: 'Amount is required',
      };
    }
    if (!isNumeric(input.amount)) {
      return {
        type: 'amount',
        text: 'Must be a number',
      };
    }
    if (!wallet) {
      return {
        type: 'withdrawTokens',
        text: 'Wallet not found.',
      };
    }

    if (!token) {
      return {
        type: 'withdrawTokens',
        text: 'Token not found.',
      };
    }
    if (
      parseFloat(input.amount) >
      parseFloat(wallet?.tokens?.[token?.symbol || ''] || '0')
    ) {
      return {
        type: 'amount',
        text: `You can withdraw maximum ${
          wallet?.tokens?.[token?.symbol || ''] || '0'
        } tokens`,
      };
    }
    return true;
  };

  const handleWithdrawTokensAction = async (
    accessToken: string,
    input: WalletsWithdrawTokensInput,
    userChainId: string,
    wallet: LiquidityWalletType | null,
    token: TokenType | null,
    liquidityWalletAbi: any
  ) => {
    dispatch(walletsStoreActions.clearError());

    const validate = validateWithdrawTokensAction(input, wallet, token);

    if (validate !== true) {
      dispatch(walletsStoreActions.setError(validate));
      return;
    }

    if (!liquidityWalletAbi) {
      dispatch(
        walletsStoreActions.setError({
          type: 'withdrawTokens',
          text: 'Contract ABI not found.',
        })
      );

      return;
    }
    dispatch(walletsStoreActions.setLoading(true));

    if (!userChainId || wallet?.chainId !== userChainId) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [
            {
              chainId: getChainIdHex(wallet?.chainId || ''),
            },
          ],
        });
      } catch (error: any) {
        dispatch(
          walletsStoreActions.setError({
            type: 'withdrawTokens',
            text: 'Chain switching failed.',
          })
        );
        dispatch(walletsStoreActions.setLoading(false));
        return;
      }
    }

    const signer = getSigner();
    const ethers = getEthers();

    const _grtLiquidityWallet = new ethers.Contract(
      wallet?.walletAddress || '',
      liquidityWalletAbi,
      signer
    );

    const grtLiquidityWallet = _grtLiquidityWallet.connect(signer);

    let txTransfer;
    try {
      txTransfer = await grtLiquidityWallet.withdrawNative(
        ethers.utils.parseEther(input.amount)
      );
    } catch (error: any) {
      dispatch(
        walletsStoreActions.setError({
          type: 'withdrawTokens',
          text: getErrorMessage(error.error, 'Transfer transaction error'),
        })
      );
      console.error('transfer error', error.error);
      dispatch(walletsStoreActions.setLoading(false));
      return;
    }

    if (!txTransfer) {
      dispatch(
        walletsStoreActions.setError({
          type: 'withdrawTokens',
          text: 'Transfer transaction failed',
        })
      );
      dispatch(walletsStoreActions.setLoading(false));
      return;
    }

    try {
      await txTransfer.wait();
    } catch (error: any) {
      dispatch(
        walletsStoreActions.setError({
          type: 'withdrawTokens',
          text: error?.message || 'Transaction error',
        })
      );
      console.error('txTransfer.wait error', error);
      dispatch(walletsStoreActions.setLoading(false));
      return;
    }

    const amountStored = wallet?.tokens[token?.symbol || ''] || 0;

    const isUpdated = await updateWalletRequest(accessToken, {
      walletAddress: wallet?.walletAddress || '',
      chainId: wallet?.chainId || '',
      tokenId: token?.symbol || '',
      amount: (Number(amountStored) - Number(input.amount)).toString(),
    });

    if (!isUpdated) {
      dispatch(
        walletsStoreActions.setError({
          type: 'withdrawTokens',
          text: 'Transaction error',
        })
      );
      dispatch(walletsStoreActions.setLoading(false));
      return;
    }
    dispatch(walletsStoreActions.clearWithdrawTokensInput());
    dispatch(walletsStoreActions.setLoading(false));
    navigate(ROUTES.SELL.WALLETS.ROOT.FULL_PATH);
  };

  useEffect(() => {
    if (accessToken) {
      fetchWallets(accessToken);
    }
  }, [accessToken, fetchWallets]);

  return (
    <WalletsContext.Provider
      value={{
        handleWalletsCreateAction,
        handleAddTokensAction,
        handleWithdrawTokensAction,
        handleWalletsCreateInputChange,
        handleWalletsAddtokensInputChange,
        handleWalletsWithdrawtokensInputChange,
      }}
    >
      {children}
    </WalletsContext.Provider>
  );
};

export const useWalletsProvider = () => useContext(WalletsContext);

export default WalletsProvider;
