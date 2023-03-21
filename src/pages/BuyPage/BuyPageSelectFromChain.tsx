import React from 'react';
import { Box } from '@mui/system';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import DexCard from '../../components/grindery/DexCard/DexCard';
import DexCardBody from '../../components/grindery/DexCard/DexCardBody';
import DexCardHeader from '../../components/grindery/DexCard/DexCardHeader';
import { IconButton } from '@mui/material';
import useBuyPage from '../../hooks/useBuyPage';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import DexChainsList from '../../components/grindery/DexChainsList/DexChainsList';
import useGrinderyChains from '../../hooks/useGrinderyChains';
import DexTokenSearch from '../../components/grindery/DexTokenSearch/DexTokenSearch';
import DexTokensList from '../../components/grindery/DexTokensList/DexTokensList';
import DexTokensNotFound from '../../components/grindery/DexTokensNotFound/DexTokensNotFound';
import { Chain } from '../../types/Chain';
import { GRT_CONTRACT_ADDRESS } from '../../constants';

type Props = {};

const BuyPageSelectFromChain = (props: Props) => {
  const { VIEWS, fromChain, handleFromChainChange } = useBuyPage();
  const { chains } = useGrinderyChains();
  let navigate = useNavigate();

  return (
    <DexCard>
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
        <DexChainsList
          chain={fromChain?.value || ''}
          chains={chains.map((chain: Chain) => ({
            ...chain,
            tokens: [
              {
                id: 4,
                address: GRT_CONTRACT_ADDRESS[chain.value] || '',
                symbol: 'GRT',
                icon: 'https://flow.grindery.org/logo192.png',
              },
            ],
          }))}
          onClick={(chain: Chain) => {
            handleFromChainChange(chain);
            navigate(VIEWS.ROOT.fullPath);
          }}
        />
        <Box height="20px" />
      </DexCardBody>
    </DexCard>
  );
};

export default BuyPageSelectFromChain;
