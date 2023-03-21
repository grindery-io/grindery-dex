import React from 'react';
import { IconButton } from '@mui/material';
import { Box } from '@mui/system';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import DexCardHeader from '../../components/grindery/DexCard/DexCardHeader';
import DexChainsList from '../../components/grindery/DexChainsList/DexChainsList';
import { Chain } from '../../types/Chain';
import { useNavigate } from 'react-router-dom';
import useGrinderyChains from '../../hooks/useGrinderyChains';
import useFaucetPage from '../../hooks/useFaucetPage';
import DexCardBody from '../../components/grindery/DexCard/DexCardBody';

function FaucetPageSelectChain() {
  const { VIEWS, chain, setChain } = useFaucetPage();
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
              navigate(VIEWS.ROOT.fullPath);
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        }
        endAdornment={<Box width={28} height={40} />}
      />
      <DexCardBody>
        <DexChainsList
          chains={chains}
          chain={chain}
          onClick={(blockchain: Chain) => {
            setChain(blockchain.value);
            navigate(VIEWS.ROOT.fullPath);
          }}
        />
        <Box pb="20px"></Box>
      </DexCardBody>
    </>
  );
}

export default FaucetPageSelectChain;
