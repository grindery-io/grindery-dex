import React from 'react';
import { Box } from '@mui/system';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import DexCard from '../../components/DexCard/DexCard';
import DexCardBody from '../../components/DexCard/DexCardBody';
import DexCardHeader from '../../components/DexCard/DexCardHeader';
import { IconButton } from '@mui/material';
import useTradePage from '../../hooks/useTradePage';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import ChainsList from '../../components/ChainsList/ChainsList';
import useGrinderyChains from '../../hooks/useGrinderyChains';
import TokenSearch from '../../components/TokenSearch/TokenSearch';
import TokensList from '../../components/TokensList/TokensList';
import NotFound from '../../components/NotFound/NotFound';
import { Chain } from '../../types/Chain';

type Props = {};

const TradePageSelectFromChainAndToken = (props: Props) => {
  const {
    VIEWS,
    searchToken,
    setSearchToken,
    fromChain,
    handleFromChainChange,
    fromChainTokens,
    currentFromChain,
    handleFromTokenChange,
  } = useTradePage();
  const { chains, isLoading: chainsIsLoading } = useGrinderyChains();
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
        <ChainsList
          chain={fromChain?.value || ''}
          chains={filteredChains}
          onClick={handleFromChainChange}
          loading={chainsIsLoading}
        />
        <TokenSearch
          value={searchToken}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setSearchToken(event.target.value);
          }}
        />
        {chainsIsLoading ? (
          <TokensList
            tokens={fromChainTokens}
            onClick={handleFromTokenChange}
            loading={chainsIsLoading}
            chainLabel={fromChain?.label}
          />
        ) : (
          <>
            {currentFromChain &&
            fromChainTokens &&
            fromChainTokens.length > 0 ? (
              <TokensList
                tokens={fromChainTokens}
                onClick={handleFromTokenChange}
                loading={chainsIsLoading}
                chainLabel={fromChain?.label}
              />
            ) : (
              <NotFound
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
          </>
        )}

        <Box height="20px" />
      </DexCardBody>
    </DexCard>
  );
};

export default TradePageSelectFromChainAndToken;
