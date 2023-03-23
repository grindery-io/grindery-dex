import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { useGrinderyNexus } from 'use-grindery-nexus';
import { Box } from '@mui/system';
import { AddCircleOutline as AddCircleOutlineIcon } from '@mui/icons-material';
import DexCardHeader from '../../components/grindery/DexCard/DexCardHeader';
import DexCardSubmitButton from '../../components/grindery/DexCard/DexCardSubmitButton';
import DexCardBody from '../../components/grindery/DexCard/DexCardBody';
import { LiquidityWallet } from '../../types/LiquidityWallet';
import DexLiquidityWallet from '../../components/grindery/DexLiquidityWallet/DexLiquidityWallet';
import { useNavigate } from 'react-router-dom';
import useGrinderyChains from '../../hooks/useGrinderyChains';
import useLiquidityWalletPage from '../../hooks/useLiquidityWalletPage';
import useLiquidityWallets from '../../hooks/useLiquidityWallets';
import DexLoading from '../../components/grindery/DexLoading/DexLoading';

function LiquidityWalletPageRoot() {
  const { user, connect } = useGrinderyNexus();
  const { VIEWS } = useLiquidityWalletPage();
  let navigate = useNavigate();
  const { wallets, isLoading: walletsIsLoading } = useLiquidityWallets();

  const { chains } = useGrinderyChains();

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
            wallets.map((wallet: LiquidityWallet) => {
              const walletChain = {
                icon: chains.find(
                  (c) => c.value.split(':')[1] === wallet.chainId
                )?.icon,
                label: chains.find(
                  (c) => c.value.split(':')[1] === wallet.chainId
                )?.label,
                nativeToken: chains.find(
                  (c) => c.value.split(':')[1] === wallet.chainId
                )?.nativeToken,
              };
              return (
                <DexLiquidityWallet
                  key={wallet._id}
                  wallet={wallet}
                  walletChain={walletChain}
                  onClick={(w: LiquidityWallet) => {
                    navigate(VIEWS.TOKENS.fullPath.replace(':walletId', w._id));
                  }}
                />
              );
            })}
          {user && walletsIsLoading && <DexLoading />}
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
