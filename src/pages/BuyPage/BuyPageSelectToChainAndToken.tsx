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

type Props = {};

const BuyPageSelectChainAndToken = (props: Props) => {
  const {
    VIEWS,
    searchToken,
    setSearchToken,
    toChain,
    handleToChainChange,
    chainTokens,
    currentToChain,
    handleToTokenChange,
  } = useBuyPage();
  const { chains } = useGrinderyChains();
  let navigate = useNavigate();
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
          chain={toChain?.value || ''}
          chains={chains}
          onClick={handleToChainChange}
        />
        <DexTokenSearch
          value={searchToken}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setSearchToken(event.target.value);
          }}
        />

        {currentToChain && chainTokens && chainTokens.length > 0 ? (
          <DexTokensList tokens={chainTokens} onClick={handleToTokenChange} />
        ) : (
          <DexTokensNotFound
            text={
              !currentToChain ? (
                <>Please, select a chain to see a list of tokens.</>
              ) : (
                <>
                  We couldn't find tokens{' '}
                  {currentToChain ? `on ${currentToChain?.label} chain` : ''}.
                  Please try search again or switch the chain.
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

export default BuyPageSelectChainAndToken;
