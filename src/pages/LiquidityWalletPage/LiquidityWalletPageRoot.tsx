import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton, Tooltip } from '@mui/material';
import { Box } from '@mui/system';
import { AddCircleOutline as AddCircleOutlineIcon } from '@mui/icons-material';
import { LiquidityWalletType } from '../../types';
import {
  LiquidityWallet,
  Loading,
  PageCardBody,
  PageCardHeader,
  PageCardSubmitButton,
} from '../../components';
import {
  useAppSelector,
  selectChainsStore,
  selectWalletsStore,
  selectUserStore,
} from '../../store';
import { ROUTES } from '../../config';
import { useUserProvider } from '../../providers';

function LiquidityWalletPageRoot() {
  let navigate = useNavigate();
  const { id: user } = useAppSelector(selectUserStore);
  const { connectUser } = useUserProvider();
  const { items: wallets, loading: walletsIsLoading } =
    useAppSelector(selectWalletsStore);
  const { items: chains } = useAppSelector(selectChainsStore);

  return (
    <>
      <PageCardHeader
        title="Liquidity wallets"
        endAdornment={
          user && wallets.length > 4 && wallets.length < chains.length ? (
            <Tooltip title="Create wallet">
              <IconButton
                size="medium"
                edge="end"
                onClick={() => {
                  navigate(ROUTES.SELL.WALLETS.CREATE.FULL_PATH);
                }}
              >
                <AddCircleOutlineIcon sx={{ color: 'black' }} />
              </IconButton>
            </Tooltip>
          ) : null
        }
      />
      <PageCardBody>
        <>
          {user &&
            wallets.map((wallet: LiquidityWalletType) => {
              const walletChain = {
                icon: chains.find((c) => c.chainId === wallet.chainId)?.icon,
                label: chains.find((c) => c.chainId === wallet.chainId)?.label,
                nativeToken: chains.find((c) => c.chainId === wallet.chainId)
                  ?.nativeToken,
              };
              return (
                <LiquidityWallet
                  key={wallet._id}
                  wallet={wallet}
                  walletChain={walletChain}
                  onClick={(w: LiquidityWalletType) => {
                    navigate(
                      ROUTES.SELL.WALLETS.TOKENS.FULL_PATH.replace(
                        ':walletId',
                        w._id
                      )
                    );
                  }}
                />
              );
            })}
          {user && walletsIsLoading && <Loading />}
          {wallets.length < chains.length ? (
            <PageCardSubmitButton
              label={user ? 'Create wallet' : 'Connect wallet'}
              onClick={
                user
                  ? () => {
                      navigate(ROUTES.SELL.WALLETS.CREATE.FULL_PATH);
                    }
                  : () => {
                      connectUser();
                    }
              }
            />
          ) : (
            <Box pb="20px"></Box>
          )}
        </>
      </PageCardBody>
    </>
  );
}

export default LiquidityWalletPageRoot;
