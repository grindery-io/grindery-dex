import React from 'react';
import { IconButton } from '@mui/material';
import { Box } from '@mui/system';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import DexCardHeader from '../../components/grindery/DexCard/DexCardHeader';
import DexChainsList from '../../components/grindery/DexChainsList/DexChainsList';
import DexTokenSearch from '../../components/grindery/DexTokenSearch/DexTokenSearch';
import DexTokensList from '../../components/grindery/DexTokensList/DexTokensList';
import DexTokensNotFound from '../../components/grindery/DexTokensNotFound/DexTokensNotFound';
import { useNavigate } from 'react-router-dom';
import useGrinderyChains from '../../hooks/useGrinderyChains';
import useOffersPage from '../../hooks/useOffersPage';

function OffersPageSelectChain() {
  const {
    chain,
    searchToken,
    currentChain,
    chainTokens,
    setErrorMessage,
    setChain,
    setToken,
    setSearchToken,
    VIEWS,
  } = useOffersPage();
  let navigate = useNavigate();

  const { chains } = useGrinderyChains();

  return (
    <>
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
              navigate(VIEWS.CREATE.fullPath);
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        }
        endAdornment={<Box width={28} height={40} />}
      />
      <DexChainsList
        chain={chain}
        chains={chains}
        onClick={(blockchain: any) => {
          setChain(blockchain.value);
          setToken('');
        }}
      />
      <DexTokenSearch
        value={searchToken}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setSearchToken(event.target.value);
        }}
      />

      {chain && chainTokens && chainTokens.length > 0 ? (
        <DexTokensList
          tokens={chainTokens}
          onClick={(chainToken: any) => {
            setToken(chainToken);
            setSearchToken('');
            setErrorMessage({
              type: '',
              text: '',
            });
            navigate(VIEWS.CREATE.fullPath);
          }}
        />
      ) : (
        <DexTokensNotFound
          text={
            !currentChain ? (
              <>Please, select a chain to see a list of tokens.</>
            ) : (
              <>
                We couldn't find tokens{' '}
                {currentChain ? `on ${currentChain?.label} chain` : ''}. Please
                try search again or switch the chain.
              </>
            )
          }
        />
      )}
    </>
  );
}

export default OffersPageSelectChain;
