import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import { Box } from '@mui/system';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { ChainsList, PageCardBody, PageCardHeader } from '../../components';
import { ChainType, LiquidityWalletType } from '../../types';
import {
  useAppSelector,
  selectChainsStore,
  selectWalletsStore,
} from '../../store';
import { ROUTES } from '../../config';
import { useWalletsProvider } from '../../providers';

function LiquidityWalletPageSelectChain() {
  let navigate = useNavigate();
  const { items: chains } = useAppSelector(selectChainsStore);
  const {
    items: wallets,
    input: { create },
  } = useAppSelector(selectWalletsStore);
  const { chainId } = create;
  const { handleWalletsCreateInputChange } = useWalletsProvider();

  return (
    <>
      <PageCardHeader
        title="Select blockchain"
        titleSize={18}
        titleAlign="center"
        startAdornment={
          <IconButton
            size="medium"
            edge="start"
            onClick={() => {
              navigate(ROUTES.SELL.WALLETS.CREATE.FULL_PATH);
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        }
        endAdornment={<Box width={28} height={40} />}
      />
      <PageCardBody>
        <ChainsList
          chain={chainId}
          chains={chains.filter(
            (chain: ChainType) =>
              !wallets
                .map((wallet: LiquidityWalletType) => wallet.chainId)
                .includes(chain.chainId)
          )}
          onClick={(chain: ChainType) => {
            handleWalletsCreateInputChange('chainId', chain.chainId);
            navigate(ROUTES.SELL.WALLETS.CREATE.FULL_PATH);
          }}
        />
        <Box height="20px" />
      </PageCardBody>
    </>
  );
}

export default LiquidityWalletPageSelectChain;
