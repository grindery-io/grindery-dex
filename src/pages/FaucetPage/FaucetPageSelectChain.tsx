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
      <Box pb="20px">
        <DexChainsList
          chains={chains}
          chain={chain}
          onClick={(blockchain: Chain) => {
            setChain(blockchain.value);
            navigate(VIEWS.ROOT.fullPath);
          }}
        />
      </Box>
    </>
  );
}

export default FaucetPageSelectChain;
