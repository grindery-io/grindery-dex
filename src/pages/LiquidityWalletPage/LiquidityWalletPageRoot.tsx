import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { useGrinderyNexus } from 'use-grindery-nexus';
import { Box } from '@mui/system';
import { AddCircleOutline as AddCircleOutlineIcon } from '@mui/icons-material';
import DexCardHeader from '../../components/DexCard/DexCardHeader';
import DexCardSubmitButton from '../../components/DexCard/DexCardSubmitButton';
import DexCardBody from '../../components/DexCard/DexCardBody';
import { LiquidityWalletType } from '../../types/LiquidityWalletType';
import LiquidityWallet from '../../components/LiquidityWallet/LiquidityWallet';
import { useNavigate } from 'react-router-dom';
import useLiquidityWalletPage from '../../hooks/useLiquidityWalletPage';
import useLiquidityWallets from '../../hooks/useLiquidityWallets';
import Loading from '../../components/Loading/Loading';
import { useAppSelector } from '../../store/storeHooks';
import { selectChainsItems } from '../../store/slices/chainsSlice';

function LiquidityWalletPageRoot() {
  const { user, connect } = useGrinderyNexus();
  const { VIEWS } = useLiquidityWalletPage();
  let navigate = useNavigate();
  const { wallets, isLoading: walletsIsLoading } = useLiquidityWallets();

  const chains = useAppSelector(selectChainsItems);

  return (
    <>
      <DexCardHeader
        title="Liquidity wallets"
        endAdornment={
          user && wallets.length > 4 && wallets.length < chains.length ? (
            <Tooltip title="Create wallet">
              <IconButton
                size="medium"
                edge="end"
                onClick={() => {
                  navigate(VIEWS.CREATE.fullPath);
                }}
              >
                <AddCircleOutlineIcon sx={{ color: 'black' }} />
              </IconButton>
            </Tooltip>
          ) : null
        }
      />
      <DexCardBody>
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
                    navigate(VIEWS.TOKENS.fullPath.replace(':walletId', w._id));
                  }}
                />
              );
            })}
          {user && walletsIsLoading && <Loading />}
          {wallets.length < chains.length ? (
            <DexCardSubmitButton
              label={user ? 'Create wallet' : 'Connect wallet'}
              onClick={
                user
                  ? () => {
                      navigate(VIEWS.CREATE.fullPath);
                    }
                  : () => {
                      connect();
                    }
              }
            />
          ) : (
            <Box pb="20px"></Box>
          )}
        </>
      </DexCardBody>
    </>
  );
}

export default LiquidityWalletPageRoot;
