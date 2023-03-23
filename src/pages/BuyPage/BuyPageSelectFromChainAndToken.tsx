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

type Props = {};

const BuyPageSelectFromChainAndToken = (props: Props) => {
  const {
    VIEWS,
    searchToken,
    setSearchToken,
    fromChain,
    handleFromChainChange,
    fromChainTokens,
    currentFromChain,
    handleFromTokenChange,
  } = useBuyPage();
  const { chains } = useGrinderyChains();
  let navigate = useNavigate();
  const filteredChains = chains.filter((c: Chain) => c.value === 'eip155:5');
  return (
    <DexCard>
      <DexCardHeader
        title="Select chain and token"
        titleSize={18}
        titleAlign="center"
        startAdornment={
          <IconButton
            size="medium"
            edge="start"
            onClick={() => {
              setSearchToken('');
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
          chains={filteredChains}
          onClick={handleFromChainChange}
        />
        <DexTokenSearch
          value={searchToken}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setSearchToken(event.target.value);
          }}
        />

        {currentFromChain && fromChainTokens && fromChainTokens.length > 0 ? (
          <DexTokensList
            tokens={fromChainTokens}
            onClick={handleFromTokenChange}
          />
        ) : (
          <DexTokensNotFound
            text={
              !currentFromChain ? (
                <>Please, select a chain to see a list of tokens.</>
              ) : (
                <>
                  We couldn't find tokens{' '}
                  {currentFromChain
                    ? `on ${currentFromChain?.label} chain`
                    : ''}
                  . Please try search again or switch the chain.
                </>
              )
            }
          />
        )}
        <Box height="20px" />
      </DexCardBody>
    </DexCard>
  );
};

export default BuyPageSelectFromChainAndToken;
