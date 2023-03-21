import React from 'react';
import { IconButton } from '@mui/material';
import { Box } from '@mui/system';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import DexCardHeader from '../../components/grindery/DexCard/DexCardHeader';
import DexChainsList from '../../components/grindery/DexChainsList/DexChainsList';
import useGrinderyChains from '../../hooks/useGrinderyChains';
import { useNavigate } from 'react-router-dom';
import useStakingPage from '../../hooks/useStakingPage';
import DexCardBody from '../../components/grindery/DexCard/DexCardBody';

function StakingPageSelectChain() {
  const { VIEWS, chain, setChain } = useStakingPage();
  let navigate = useNavigate();
  const { chains } = useGrinderyChains();

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
              navigate(VIEWS.STAKE.fullPath);
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        }
        endAdornment={<Box width={28} height={40} />}
      />
      <DexCardBody>
        <DexChainsList
          chain={chain}
          chains={chains}
          onClick={(blockchain: any) => {
            setChain(blockchain.value);
            navigate(VIEWS.STAKE.fullPath);
          }}
        />
        <Box height="20px" />
      </DexCardBody>
    </>
  );
}

export default StakingPageSelectChain;
