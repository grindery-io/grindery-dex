import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import { useAppDispatch, useAppSelector } from '../store/storeHooks';
import { selectUserAccessToken } from '../store/slices/userSlice';
import {
  WalletsAddTokensInput,
  WalletsAddTokensInputFieldName,
  WalletsCreateInput,
  WalletsCreateInputFieldName,
  WalletsWithdrawTokensInput,
  WalletsWithdrawTokensInputFieldName,
  clearWalletsAddTokensInput,
  clearWalletsCreateInput,
  clearWalletsError,
  clearWalletsWithdrawTokensInput,
  setWalletsAddTokensInputValue,
  setWalletsCreateInputValue,
  setWalletsError,
  setWalletsItems,
  setWalletsLoading,
  setWalletsWithdrawTokensInputValue,
} from '../store/slices/walletsSlice';
import {
  addWalletRequest,
  getWalletsRequest,
  getWalletRequest,
  updateWalletRequest,
} from '../services/walletServices';
import { ErrorMessageType } from '../types/ErrorMessageType';
import { LiquidityWalletType } from '../types/LiquidityWalletType';
import { getChainIdHex } from '../utils/helpers/chainHelpers';
import { useUserController } from './UserController';
import { GRTSATELLITE_CONTRACT_ADDRESS } from '../config/constants';
import { getErrorMessage } from '../utils/error';
import { getWalletAddressFromReceipt } from '../utils/helpers/walletHelpers';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../config/routes';
import isNumeric from '../utils/isNumeric';
import { TokenType } from '../types/TokenType';

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

type WalletsControllerProps = {
  children: React.ReactNode;
};

export const WalletsController = ({ children }: WalletsControllerProps) => {
  let navigate = useNavigate();
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector(selectUserAccessToken);
  const { getSigner, getEthers } = useUserController();

  const fetchWallets = useCallback(
    async (accessToken: string) => {
      dispatch(setWalletsLoading(true));
      const wallets = await getWalletsRequest(accessToken).catch(
        (error: any) => {
          // TODO handle orders fetching error
        }
      );
      dispatch(setWalletsItems(wallets || []));
      dispatch(setWalletsLoading(false));
    },
    [dispatch]
  );

  const handleWalletsCreateInputChange = (
    name: WalletsCreateInputFieldName,
    value: string
  ) => {
    dispatch(clearWalletsError());
    dispatch(setWalletsCreateInputValue({ name, value }));
  };

  const handleWalletsAddtokensInputChange = (
    name: WalletsAddTokensInputFieldName,
    value: string
  ) => {
    dispatch(clearWalletsError());
    dispatch(setWalletsAddTokensInputValue({ name, value }));
  };

  const handleWalletsWithdrawtokensInputChange = (
    name: WalletsWithdrawTokensInputFieldName,
    value: string
  ) => {
    dispatch(clearWalletsError());
    dispatch(setWalletsWithdrawTokensInputValue({ name, value }));
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
    dispatch(clearWalletsError());

    const validate = validateWalletsCreateAction(input);
    if (validate !== true) {
      dispatch(setWalletsError(validate));
      return;
    }

    if (!satelliteAbi) {
      dispatch(
        setWalletsError({
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
        setWalletsError({
          type: 'chain',
          text: `You already have wallet for this chain. Please, select another.`,
        })
      );
      return;
    }

    dispatch(setWalletsLoading(true));

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
          setWalletsError({
            type: 'createWallet',
            text: `Chain switching failed`,
          })
        );
        dispatch(setWalletsLoading(false));
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
          setWalletsError({
            type: 'createWallet',
            text: getErrorMessage(
              error.error,
              'Create wallet transaction error'
            ),
          })
        );
        console.error('create wallet error', error.error);
        dispatch(setWalletsLoading(false));
        return;
      });

    if (!tx) {
      dispatch(
        setWalletsError({
          type: 'createWallet',
          text: 'Create wallet transaction failed',
        })
      );
      dispatch(setWalletsLoading(false));
      return;
    }

    let receipt;
    try {
      receipt = await tx.wait();
    } catch (error: any) {
      dispatch(
        setWalletsError({
          type: 'createWallet',
          text: error?.message || 'Transaction error',
        })
      );
      console.error('tx.wait error', error);
      dispatch(setWalletsLoading(false));
      return;
    }

    const walletAddress = getWalletAddressFromReceipt(receipt);

    const createdWalletId = await addWalletRequest(accessToken, {
      chainId: input.chainId,
      walletAddress: walletAddress,
    });

    if (!createdWalletId) {
      dispatch(
        setWalletsError({
          type: 'createWallet',
          text: 'Wallet saving error',
        })
      );
      dispatch(setWalletsLoading(false));
      return;
    }

    const wallet = await getWalletRequest(accessToken, createdWalletId).catch(
      () => {
        dispatch(
          setWalletsError({
            type: 'createWallet',
            text: 'Wallet saving error',
          })
        );
        dispatch(setWalletsLoading(false));
      }
    );

    if (!wallet) {
      return;
    }

    dispatch(
      setWalletsItems([
        {
          ...wallet,
          new: true,
        },
        ...[...wallets],
      ])
    );
    dispatch(setWalletsLoading(false));
    dispatch(clearWalletsError());
    dispatch(clearWalletsCreateInput());
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
    dispatch(clearWalletsError());

    const validate = validateAddTokensAction(input);

    if (validate !== true) {
      dispatch(setWalletsError(validate));
      return;
    }

    if (!wallet) {
      dispatch(
        setWalletsError({
          type: 'addTokens',
          text: 'Wallet not found.',
        })
      );
      return;
    }

    if (!token) {
      dispatch(
        setWalletsError({
          type: 'addTokens',
          text: 'Token not found.',
        })
      );
      return;
    }

    dispatch(setWalletsLoading(true));

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
          setWalletsError({
            type: 'addTokens',
            text: 'Chain switching failed.',
          })
        );
        dispatch(setWalletsLoading(false));
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
          setWalletsError({
            type: 'addTokens',
            text: getErrorMessage(error, 'Transfer transaction error'),
          })
        );
        console.error('transfer error', error);
        dispatch(setWalletsLoading(false));
        return;
      });

    if (!txTransfer) {
      dispatch(
        setWalletsError({
          type: 'addTokens',
          text: 'Transfer transaction failed',
        })
      );
      dispatch(setWalletsLoading(false));
      return;
    }
    try {
      await txTransfer.wait();
    } catch (error: any) {
      dispatch(
        setWalletsError({
          type: 'addTokens',
          text: error?.message || 'Transaction error',
        })
      );
      console.error('txTransfer.wait error', error);
      dispatch(setWalletsLoading(false));
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
        setWalletsError({
          type: 'addTokens',
          text: 'Transaction error',
        })
      );
      dispatch(setWalletsLoading(false));
      return;
    }

    dispatch(setWalletsLoading(false));
    dispatch(clearWalletsAddTokensInput());
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
    dispatch(clearWalletsError());

    const validate = validateWithdrawTokensAction(input, wallet, token);

    if (validate !== true) {
      dispatch(setWalletsError(validate));
      return;
    }

    if (!liquidityWalletAbi) {
      dispatch(
        setWalletsError({
          type: 'withdrawTokens',
          text: 'Contract ABI not found.',
        })
      );

      return;
    }
    dispatch(setWalletsLoading(true));

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
          setWalletsError({
            type: 'withdrawTokens',
            text: 'Chain switching failed.',
          })
        );
        dispatch(setWalletsLoading(false));
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
        setWalletsError({
          type: 'withdrawTokens',
          text: getErrorMessage(error.error, 'Transfer transaction error'),
        })
      );
      console.error('transfer error', error.error);
      dispatch(setWalletsLoading(false));
      return;
    }

    if (!txTransfer) {
      dispatch(
        setWalletsError({
          type: 'withdrawTokens',
          text: 'Transfer transaction failed',
        })
      );
      dispatch(setWalletsLoading(false));
      return;
    }

    try {
      await txTransfer.wait();
    } catch (error: any) {
      dispatch(
        setWalletsError({
          type: 'withdrawTokens',
          text: error?.message || 'Transaction error',
        })
      );
      console.error('txTransfer.wait error', error);
      dispatch(setWalletsLoading(false));
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
        setWalletsError({
          type: 'withdrawTokens',
          text: 'Transaction error',
        })
      );
      dispatch(setWalletsLoading(false));
      return;
    }
    dispatch(clearWalletsWithdrawTokensInput());
    dispatch(setWalletsLoading(false));
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

export const useWalletsController = () => useContext(WalletsContext);

export default WalletsController;
