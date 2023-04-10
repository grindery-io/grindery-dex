import React, { useEffect } from 'react';
import { IconButton } from '@mui/material';
import { Box } from '@mui/system';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import DexCardHeader from '../../components/DexCard/DexCardHeader';
import DexCardSubmitButton from '../../components/DexCard/DexCardSubmitButton';
import DexCardBody from '../../components/DexCard/DexCardBody';
import Loading from '../../components/Loading/Loading';
import TextInput from '../../components/TextInput/TextInput';
import { useNavigate, useParams } from 'react-router-dom';
import SelectTokenButton from '../../components/SelectTokenButton/SelectTokenButton';
import AlertBox from '../../components/AlertBox/AlertBox';
import { useAppDispatch, useAppSelector } from '../../store/storeHooks';
import { selectChainsItems } from '../../store/slices/chainsSlice';
import {
  selectUserAccessToken,
  selectUserChainId,
  selectUserId,
} from '../../store/slices/userSlice';
import { useUserController } from '../../controllers/UserController';
import {
  clearWalletsAddTokensInput,
  selectWalletsAddTokensInput,
  selectWalletsError,
  selectWalletsItems,
  selectWalletsLoading,
} from '../../store/slices/walletsSlice';
import { ROUTES } from '../../config/routes';
import {
  getWalletById,
  getWalletChain,
} from '../../utils/helpers/walletHelpers';
import { useWalletsController } from '../../controllers/WalletsController';
import {
  getTokenById,
  getTokenBySymbol,
} from '../../utils/helpers/tokenHelpers';

function LiquidityWalletPageAdd() {
  let navigate = useNavigate();
  let { walletId, tokenSymbol } = useParams();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUserId);
  const { connectUser: connect } = useUserController();
  const accessToken = useAppSelector(selectUserAccessToken);
  const userChainId = useAppSelector(selectUserChainId);
  const chains = useAppSelector(selectChainsItems);
  const wallets = useAppSelector(selectWalletsItems);
  const walletsIsLoading = useAppSelector(selectWalletsLoading);
  const loading = useAppSelector(selectWalletsLoading);
  const errorMessage = useAppSelector(selectWalletsError);
  const input = useAppSelector(selectWalletsAddTokensInput);
  const { amount, tokenId } = input;
  const currentWallet = getWalletById(walletId || '', wallets);
  const walletChain = currentWallet
    ? getWalletChain(currentWallet, chains)
    : null;
  const token = getTokenById(tokenId, walletChain?.chainId || '', chains);
  const preselectedToken =
    tokenSymbol && tokenSymbol !== 'any'
      ? getTokenBySymbol(tokenSymbol, walletChain?.chainId || '', chains)
      : null;
  const { handleWalletsAddtokensInputChange, handleAddTokensAction } =
    useWalletsController();

  useEffect(() => {
    if (!currentWallet && !walletsIsLoading) {
      navigate(ROUTES.SELL.WALLETS.ROOT.FULL_PATH);
    }
  }, [currentWallet, walletsIsLoading]);

  useEffect(() => {
    if (preselectedToken) {
      handleWalletsAddtokensInputChange(
        'tokenId',
        preselectedToken.coinmarketcapId || ''
      );
    }
  }, [preselectedToken]);

  return (
    <>
      <DexCardHeader
        title="Add funds"
        titleSize={18}
        titleAlign="center"
        startAdornment={
          <IconButton
            size="medium"
            edge="start"
            onClick={() => {
              dispatch(clearWalletsAddTokensInput());
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
            <SelectTokenButton
              onClick={() => {
                navigate(
                  ROUTES.SELL.WALLETS.SELECT_TOKEN.FULL_PATH.replace(
                    ':walletId',
                    walletId || ''
                  )
                );
              }}
              title="Token"
              token={token || ''}
              error={errorMessage}
            />
            <TextInput
              label="Amount"
              value={amount}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                handleWalletsAddtokensInputChange('amount', event.target.value);
              }}
              name="amount"
              placeholder="Enter amount of tokens"
              disabled={false}
              error={errorMessage}
            />
            {errorMessage &&
              errorMessage.type === 'addTokens' &&
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
                  ? 'Add funds'
                  : 'Connect wallet'
              }
              onClick={
                user
                  ? () => {
                      handleAddTokensAction(
                        accessToken,
                        input,
                        userChainId,
                        currentWallet,
                        token
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

export default LiquidityWalletPageAdd;
