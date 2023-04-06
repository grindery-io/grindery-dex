import React from 'react';
import { IconButton } from '@mui/material';
import { Box } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import DexCardBody from '../../components/DexCard/DexCardBody';
import DexCardHeader from '../../components/DexCard/DexCardHeader';
import useAutomationsPage from '../../hooks/useAutomationsPage';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import ChainsList from '../../components/ChainsList/ChainsList';
import { ChainType } from '../../types/ChainType';
import { useAppSelector } from '../../store/storeHooks';
import {
  selectChainsItems,
  selectChainsLoading,
} from '../../store/slices/chainsSlice';

type Props = {};

const AutomationsPageSelectChain = (props: Props) => {
  const { chain, handleChainChange, VIEWS } = useAutomationsPage();
  const chains = useAppSelector(selectChainsItems);
  const chainsIsLoading = useAppSelector(selectChainsLoading);
  const filteredChains = chains.filter((c: ChainType) => c.chainId === '97');
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
