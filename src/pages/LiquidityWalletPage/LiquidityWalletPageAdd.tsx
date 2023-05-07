import React, { useEffect } from 'react';
import { IconButton } from '@mui/material';
import { Box } from '@mui/system';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import {
  AlertBox,
  Loading,
  TextInput,
  SelectTokenButton,
  PageCardHeader,
  PageCardBody,
  PageCardSubmitButton,
} from '../../components';
import {
  useAppDispatch,
  useAppSelector,
  selectChainsStore,
  selectWalletsStore,
  walletsStoreActions,
  selectUserStore,
} from '../../store';
import { useUserProvider, useWalletsProvider } from '../../providers';
import { ROUTES } from '../../config';
import {
  getWalletById,
  getWalletChain,
  getTokenById,
  getTokenBySymbol,
} from '../../utils';

function LiquidityWalletPageAdd() {
  let navigate = useNavigate();
  let { walletId, tokenSymbol } = useParams();
  const dispatch = useAppDispatch();
  const {
    id: user,
    accessToken,
    chainId: userChainId,
  } = useAppSelector(selectUserStore);
  const { connectUser: connect } = useUserProvider();
  const { items: chains } = useAppSelector(selectChainsStore);
  const {
    items: wallets,
    loading,
    error: errorMessage,
    input: { add },
  } = useAppSelector(selectWalletsStore);
  const { amount, tokenId } = add;
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
    useWalletsProvider();

  useEffect(() => {
    if (!currentWallet && !loading) {
      navigate(ROUTES.SELL.WALLETS.ROOT.FULL_PATH);
    }
  }, [currentWallet, loading, navigate]);

  useEffect(() => {
    if (preselectedToken) {
      handleWalletsAddtokensInputChange(
        'tokenId',
        preselectedToken.coinmarketcapId || ''
      );
    }
  }, [preselectedToken, handleWalletsAddtokensInputChange]);

  return (
    <>
      <PageCardHeader
        title="Add funds"
        titleSize={18}
        titleAlign="center"
        startAdornment={
          <IconButton
            size="medium"
            edge="start"
            onClick={() => {
              dispatch(walletsStoreActions.clearAddTokensInput());
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

      <PageCardBody>
        {user && loading ? (
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
            <PageCardSubmitButton
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
                        add,
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
      </PageCardBody>
    </>
  );
}

export default LiquidityWalletPageAdd;
