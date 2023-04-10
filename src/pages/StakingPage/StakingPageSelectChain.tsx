import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import { Box } from '@mui/system';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { ChainsList, PageCardBody, PageCardHeader } from '../../components';
import {
  useAppSelector,
  selectChainsItems,
  selectStakesCreateInput,
} from '../../store';
import { ROUTES } from '../../config';
import { useStakesController } from '../../controllers';
import { ChainType } from '../../types';

function StakingPageSelectChain() {
  let navigate = useNavigate();
  const chains = useAppSelector(selectChainsItems);
  const { handleCreateInputChange } = useStakesController();
  const { chainId } = useAppSelector(selectStakesCreateInput);
  const currentChain = chains.find((c: ChainType) => c.chainId === chainId);

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
              navigate(ROUTES.SELL.STAKING.STAKE.FULL_PATH);
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        }
        endAdornment={<Box width={28} height={40} />}
      />
      <PageCardBody>
        <ChainsList
          chain={currentChain?.value || chainId}
          chains={chains}
          onClick={(blockchain: ChainType) => {
            handleCreateInputChange('chainId', blockchain.chainId);
            navigate(ROUTES.SELL.STAKING.STAKE.FULL_PATH);
          }}
        />
        <Box height="20px" />
      </PageCardBody>
    </>
  );
}

export default StakingPageSelectChain;
