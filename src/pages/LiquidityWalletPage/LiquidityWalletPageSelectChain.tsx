import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import { Box } from '@mui/system';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import DexCardHeader from '../../components/DexCard/DexCardHeader';
import DexCardBody from '../../components/DexCard/DexCardBody';
import { ChainsList } from '../../components';
import { ChainType, LiquidityWalletType } from '../../types';
import {
  useAppSelector,
  selectChainsItems,
  selectWalletsCreateInput,
  selectWalletsItems,
} from '../../store';
import { ROUTES } from '../../config';
import { useWalletsController } from '../../controllers';

function LiquidityWalletPageSelectChain() {
  let navigate = useNavigate();
  const chains = useAppSelector(selectChainsItems);
  const wallets = useAppSelector(selectWalletsItems);
  const input = useAppSelector(selectWalletsCreateInput);
  const { chainId } = input;
  const { handleWalletsCreateInputChange } = useWalletsController();

  return (
    <>
      <DexCardHeader
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
      <DexCardBody>
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
      </DexCardBody>
    </>
  );
}

export default LiquidityWalletPageSelectChain;
