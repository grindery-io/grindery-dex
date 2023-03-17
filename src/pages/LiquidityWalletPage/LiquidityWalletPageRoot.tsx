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

function LiquidityWalletPageRoot() {
  const { user, connect } = useGrinderyNexus();
  const { wallets, VIEWS, setSelectedWallet } = useLiquidityWalletPage();
  let navigate = useNavigate();

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
                icon: chains.find((c) => c.value === wallet.chain)?.icon,
                label: chains.find((c) => c.value === wallet.chain)?.label,
                nativeToken: chains.find((c) => c.value === wallet.chain)
                  ?.nativeToken,
              };
              return (
                <DexLiquidityWallet
                  key={wallet.id}
                  wallet={wallet}
                  walletChain={walletChain}
                  /*onWithdrawClick={(w: LiquidityWallet) => {
                    setSelectedWallet(w.id);
                    navigate(VIEWS.WITHDRAW.fullPath);
                  }}
                  onAddClick={(w: LiquidityWallet) => {
                    setSelectedWallet(w.id);
                    navigate(VIEWS.ADD.fullPath);
                  }}*/
                  onClick={(w: LiquidityWallet) => {
                    setSelectedWallet(w.id);
                    navigate(VIEWS.TOKENS.fullPath);
                  }}
                />
              );
            })}
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
