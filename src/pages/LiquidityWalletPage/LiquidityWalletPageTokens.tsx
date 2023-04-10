import React, { useEffect } from 'react';
import { IconButton, Skeleton, Tooltip } from '@mui/material';
import { Box } from '@mui/system';
import { AddCircleOutline as AddCircleOutlineIcon } from '@mui/icons-material';
import DexCardHeader from '../../components/DexCard/DexCardHeader';
import DexCardSubmitButton from '../../components/DexCard/DexCardSubmitButton';
import DexCardBody from '../../components/DexCard/DexCardBody';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { TokenType } from '../../types/TokenType';
import LiquidityWalletToken, {
  WalletToken,
} from '../../components/LiquidityWalletToken/LiquidityWalletToken';
import Loading from '../../components/Loading/Loading';
import { useAppSelector } from '../../store/storeHooks';
import { selectChainsItems } from '../../store/slices/chainsSlice';
import { selectUserId } from '../../store/slices/userSlice';
import { useUserController } from '../../controllers/UserController';
import { ROUTES } from '../../config/routes';
import {
  selectWalletsItems,
  selectWalletsLoading,
} from '../../store/slices/walletsSlice';
import {
  getWalletById,
  getWalletChain,
} from '../../utils/helpers/walletHelpers';

function LiquidityWalletPageTokens() {
  let navigate = useNavigate();
  let { walletId } = useParams();
  const user = useAppSelector(selectUserId);
  const { connectUser: connect } = useUserController();
  const chains = useAppSelector(selectChainsItems);
  const wallets = useAppSelector(selectWalletsItems);
  const walletsIsLoading = useAppSelector(selectWalletsLoading);
  const currentWallet = getWalletById(walletId || '', wallets);
  const walletChain = currentWallet
    ? getWalletChain(currentWallet, chains)
    : null;

  useEffect(() => {
    if (!currentWallet && !walletsIsLoading) {
      navigate(ROUTES.SELL.WALLETS.ROOT.FULL_PATH);
    }
  }, [currentWallet, walletsIsLoading]);

  return (
    <>
      <DexCardHeader
        title={
          walletChain?.label ? (
            `${walletChain?.label || ''} chain wallet`
          ) : (
            <Skeleton width="150px" sx={{ margin: '0 auto' }} />
          )
        }
        titleSize={18}
        titleAlign="center"
        startAdornment={
          <IconButton
            size="medium"
            edge="start"
            onClick={() => {
              navigate(ROUTES.SELL.WALLETS.ROOT.FULL_PATH);
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        }
        endAdornment={
          user && Object.keys(currentWallet?.tokens || {}).length > 4 ? (
            <Tooltip title="Add tokens">
              <IconButton
                size="medium"
                edge="end"
                onClick={() => {
                  navigate(
                    ROUTES.SELL.WALLETS.ADD.FULL_PATH.replace(
                      ':walletId',
                      walletId || ''
                    )
                  );
                }}
              >
                <AddCircleOutlineIcon sx={{ color: 'black' }} />
              </IconButton>
            </Tooltip>
          ) : (
            <Box width={28} height={40} />
          )
        }
      />
      <DexCardBody>
        <>
          {user && walletsIsLoading && <Loading />}
          {user &&
            Object.keys(currentWallet?.tokens || {}).map((key: string) => {
              const token: WalletToken = {
                label: key,
                icon:
                  walletChain?.tokens?.find((t: TokenType) => t.symbol === key)
                    ?.icon || '',
                amount: currentWallet?.tokens?.[key] || '0',
              };
              return (
                <LiquidityWalletToken
                  key={token.label}
                  token={token}
                  tokenChain={walletChain || undefined}
                  onWithdrawClick={(t: WalletToken) => {
                    navigate(
                      ROUTES.SELL.WALLETS.WITHDRAW.FULL_PATH.replace(
                        ':walletId',
                        walletId || ''
                      ).replace(':tokenSymbol', t.label || '')
                    );
                  }}
                  onAddClick={(t: WalletToken) => {
                    navigate(
                      ROUTES.SELL.WALLETS.ADD.FULL_PATH.replace(
                        ':walletId',
                        walletId || ''
                      ).replace(':tokenSymbol', t.label || '')
                    );
                  }}
                />
              );
            })}

          <DexCardSubmitButton
            label={user ? 'Add tokens' : 'Connect wallet'}
            onClick={
              user
                ? () => {
                    navigate(
                      ROUTES.SELL.WALLETS.ADD.FULL_PATH.replace(
                        ':walletId',
                        walletId || ''
                      ).replace(':tokenSymbol', 'any')
                    );
                  }
                : () => {
                    connect();
                  }
            }
          />
        </>
      </DexCardBody>
    </>
  );
}

export default LiquidityWalletPageTokens;
