import React from 'react';
import { IconButton } from '@mui/material';
import { Box } from '@mui/system';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import DexCardHeader from '../../components/DexCard/DexCardHeader';
import ChainsList from '../../components/ChainsList/ChainsList';
import { useNavigate } from 'react-router-dom';
import DexCardBody from '../../components/DexCard/DexCardBody';
import { useAppSelector } from '../../store/storeHooks';
import { selectChainsItems } from '../../store/slices/chainsSlice';
import { ROUTES } from '../../config/routes';
import { useStakesController } from '../../controllers/StakesController';
import { ChainType } from '../../types/ChainType';
import { selectStakesCreateInput } from '../../store/slices/stakesSlice';

function StakingPageSelectChain() {
  let navigate = useNavigate();
  const chains = useAppSelector(selectChainsItems);
  const { handleCreateInputChange } = useStakesController();
  const { chainId } = useAppSelector(selectStakesCreateInput);
  const currentChain = chains.find((c: ChainType) => c.chainId === chainId);

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
              navigate(ROUTES.SELL.STAKING.STAKE.FULL_PATH);
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        }
        endAdornment={<Box width={28} height={40} />}
      />
      <DexCardBody>
        <ChainsList
          chain={currentChain?.value || chainId}
          chains={chains}
          onClick={(blockchain: ChainType) => {
            handleCreateInputChange('chainId', blockchain.chainId);
            navigate(ROUTES.SELL.STAKING.STAKE.FULL_PATH);
          }}
        />
        <Box height="20px" />
      </DexCardBody>
    </>
  );
}

export default StakingPageSelectChain;
