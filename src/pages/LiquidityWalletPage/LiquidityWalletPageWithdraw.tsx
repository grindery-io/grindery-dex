import React, { useEffect } from 'react';
import { IconButton, Button as MuiButton } from '@mui/material';
import { Box } from '@mui/system';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import DexCardHeader from '../../components/DexCard/DexCardHeader';
import DexCardSubmitButton from '../../components/DexCard/DexCardSubmitButton';
import DexCardBody from '../../components/DexCard/DexCardBody';
import Loading from '../../components/Loading/Loading';
import TextInput from '../../components/TextInput/TextInput';
import { LiquidityWalletType } from '../../types/LiquidityWalletType';
import { useNavigate, useParams } from 'react-router-dom';
import AlertBox from '../../components/AlertBox/AlertBox';
import { useAppDispatch, useAppSelector } from '../../store/storeHooks';
import {
  selectUserAccessToken,
  selectUserChainId,
  selectUserId,
} from '../../store/slices/userSlice';
import { useUserController } from '../../controllers/UserController';
import { selectChainsItems } from '../../store/slices/chainsSlice';
import {
  clearWalletsWithdrawTokensInput,
  selectWalletWithdrawTokensInput,
  selectWalletsError,
  selectWalletsItems,
  selectWalletsLoading,
} from '../../store/slices/walletsSlice';
import {
  getWalletById,
  getWalletChain,
} from '../../utils/helpers/walletHelpers';
import { ROUTES } from '../../config/routes';
import { getTokenBySymbol } from '../../utils/helpers/tokenHelpers';
import { useWalletsController } from '../../controllers/WalletsController';
import { selectLiquidityWalletAbi } from '../../store/slices/abiSlice';

function LiquidityWalletPageWithdraw() {
  let navigate = useNavigate();
  let { walletId, tokenSymbol } = useParams();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUserId);
  const { connectUser: connect } = useUserController();
  const accessToken = useAppSelector(selectUserAccessToken);
  const userChainId = useAppSelector(selectUserChainId);
  const chains = useAppSelector(selectChainsItems);
  const liquidityWalletAbi = useAppSelector(selectLiquidityWalletAbi);
  const wallets = useAppSelector(selectWalletsItems);
  const walletsIsLoading = useAppSelector(selectWalletsLoading);
  const loading = useAppSelector(selectWalletsLoading);
  const errorMessage = useAppSelector(selectWalletsError);
  const input = useAppSelector(selectWalletWithdrawTokensInput);
  const { amount } = input;
  const currentWallet = getWalletById(walletId || '', wallets);
  const walletChain = currentWallet
    ? getWalletChain(currentWallet, chains)
    : null;
  const preselectedToken =
    tokenSymbol && tokenSymbol !== 'any'
      ? getTokenBySymbol(tokenSymbol, walletChain?.chainId || '', chains)
      : null;
  const { handleWalletsWithdrawtokensInputChange, handleWithdrawTokensAction } =
    useWalletsController();

  useEffect(() => {
    if (!currentWallet && !walletsIsLoading) {
      navigate(ROUTES.SELL.WALLETS.ROOT.FULL_PATH);
    }
  }, [currentWallet, walletsIsLoading]);

  return (
    <>
      <DexCardHeader
        title="Withdraw"
        titleSize={18}
        titleAlign="center"
        startAdornment={
          <IconButton
            size="medium"
            edge="start"
            onClick={() => {
              dispatch(clearWalletsWithdrawTokensInput());
              navigate(
                ROUTES.SELL.WALLETS.TOKENS.FULL_PATH.replace(
                  ':walletId',
                  walletId || ''
                )
              );
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        }
        endAdornment={<Box width={28} height={40} />}
      />

      <DexCardBody>
        {user && walletsIsLoading ? (
          <Loading />
        ) : (
          <>
            <TextInput
              label="Amount"
              value={amount}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                handleWalletsWithdrawtokensInputChange(
                  'amount',
                  event.target.value
                );
              }}
              name="amount"
              placeholder="Enter amount of tokens"
              disabled={false}
              endAdornment={
                <Box
                  sx={{
                    '& button': {
                      fontSize: '14px',
                      padding: '4px 8px 5px',
                      display: 'inline-block',
                      width: 'auto',
                      margin: '0 16px 0 0',
                      background: 'rgba(63, 73, 225, 0.08)',
                      color: 'rgb(63, 73, 225)',
                      borderRadius: '8px',
                      minWidth: 0,
                      '&:hover': {
                        background: 'rgba(63, 73, 225, 0.12)',
                        color: 'rgb(63, 73, 225)',
                      },
                    },
                  }}
                >
                  <MuiButton
                    disableElevation
                    size="small"
                    variant="contained"
                    onClick={() => {
                      handleWalletsWithdrawtokensInputChange(
                        'amount',
                        wallets.find(
                          (wallet: LiquidityWalletType) =>
                            wallet._id === walletId
                        )?.tokens?.[tokenSymbol || ''] || '0'
                      );
                    }}
                  >
                    max
                  </MuiButton>
                </Box>
              }
              error={errorMessage}
            />
            {errorMessage &&
              errorMessage.type === 'withdrawTokens' &&
              errorMessage.text && (
                <AlertBox color="error">
                  <p>{errorMessage.text}</p>
                </AlertBox>
              )}
            {loading && <Loading />}
            <DexCardSubmitButton
              disabled={loading}
              label={
                loading
                  ? 'Waiting transaction'
                  : user
                  ? 'Withdraw'
                  : 'Connect wallet'
              }
              onClick={
                user
                  ? () => {
                      handleWithdrawTokensAction(
                        accessToken,
                        input,
                        userChainId,
                        currentWallet,
                        preselectedToken,
                        liquidityWalletAbi
                      );
                    }
                  : () => {
                      connect();
                    }
              }
            />
          </>
        )}
      </DexCardBody>
    </>
  );
}

export default LiquidityWalletPageWithdraw;
