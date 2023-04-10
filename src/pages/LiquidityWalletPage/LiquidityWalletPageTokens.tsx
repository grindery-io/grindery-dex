import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IconButton, Skeleton, Tooltip } from '@mui/material';
import { Box } from '@mui/system';
import { AddCircleOutline as AddCircleOutlineIcon } from '@mui/icons-material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { TokenType } from '../../types';
import LiquidityWalletToken, {
  WalletToken,
} from '../../components/LiquidityWalletToken/LiquidityWalletToken';
import {
  Loading,
  PageCardBody,
  PageCardHeader,
  PageCardSubmitButton,
} from '../../components';
import {
  useAppSelector,
  selectChainsItems,
  selectUserId,
  selectWalletsItems,
  selectWalletsLoading,
} from '../../store';
import { useUserController } from '../../controllers';
import { ROUTES } from '../../config';
import { getWalletById, getWalletChain } from '../../utils';

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
  }, [currentWallet, walletsIsLoading, navigate]);

  return (
    <>
      <PageCardHeader
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
      <PageCardBody>
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

          <PageCardSubmitButton
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
      </PageCardBody>
    </>
  );
}

export default LiquidityWalletPageTokens;
