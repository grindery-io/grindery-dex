import React from 'react';
import { IconButton } from '@mui/material';
import { Box } from '@mui/system';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import DexCardHeader from '../../components/DexCard/DexCardHeader';
import ChainsList from '../../components/ChainsList/ChainsList';
import useGrinderyChains from '../../hooks/useGrinderyChains';
import { useNavigate } from 'react-router-dom';
import useStakingPage from '../../hooks/useStakingPage';
import DexCardBody from '../../components/DexCard/DexCardBody';

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
        <ChainsList
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
