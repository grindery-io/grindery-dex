import React from 'react';
import { IconButton } from '@mui/material';
import { Box } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import DexCardBody from '../../components/DexCard/DexCardBody';
import DexCardHeader from '../../components/DexCard/DexCardHeader';
import useAutomationsPage from '../../hooks/useAutomationsPage';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import ChainsList from '../../components/ChainsList/ChainsList';
import { Chain } from '../../types/Chain';
import useGrinderyChains from '../../hooks/useGrinderyChains';

type Props = {};

const AutomationsPageSelectChain = (props: Props) => {
  const { chain, handleChainChange, VIEWS } = useAutomationsPage();
  const { chains, isLoading: chainsIsLoading } = useGrinderyChains();
  const filteredChains = chains.filter((c: Chain) => c.chainId === '97');
  let navigate = useNavigate();
  return (
    <>
      <DexCardHeader
        title="Select chain"
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
        <ChainsList
          chain={chain?.caipId || ''}
          chains={filteredChains}
          onClick={handleChainChange}
          loading={chainsIsLoading}
        />
        <Box height="20px" />
      </DexCardBody>
    </>
  );
};

export default AutomationsPageSelectChain;
