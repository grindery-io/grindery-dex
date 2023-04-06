import React from 'react';
import { IconButton } from '@mui/material';
import { Box } from '@mui/system';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import DexCardHeader from '../../components/DexCard/DexCardHeader';
import ChainsList from '../../components/ChainsList/ChainsList';
import TokenSearch from '../../components/TokenSearch/TokenSearch';
import TokensList from '../../components/TokensList/TokensList';
import NotFound from '../../components/NotFound/NotFound';
import { useNavigate } from 'react-router-dom';
import useOffersPage from '../../hooks/useOffersPage';
import DexCardBody from '../../components/DexCard/DexCardBody';
import { ChainType } from '../../types/ChainType';
import { useAppSelector } from '../../store/storeHooks';
import { selectChainsItems } from '../../store/slices/chainsSlice';

function OffersPageSelectToChain() {
  const {
    toChain,
    searchToken,
    currentToChain,
    toChainTokens,
    setErrorMessage,
    setToChain,
    setToToken,
    setSearchToken,
    VIEWS,
  } = useOffersPage();
  let navigate = useNavigate();

  const chains = useAppSelector(selectChainsItems);

  const chainLabel = chains.find((c: ChainType) => c.caipId === toChain)?.label;

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
      <DexCardBody>
        <ChainsList
          chain={toChain}
          chains={chains.filter((c: ChainType) => c.chainId === '5')}
          onClick={(blockchain: any) => {
            setToChain(blockchain.value);
            setToToken('');
          }}
        />
        <TokenSearch
          value={searchToken}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setSearchToken(event.target.value);
          }}
        />

        {toChain && toChainTokens && toChainTokens.length > 0 ? (
          <TokensList
            tokens={toChainTokens}
            onClick={(chainToken: any) => {
              setToToken(chainToken);
              setSearchToken('');
              setErrorMessage({
                type: '',
                text: '',
              });
              navigate(VIEWS.CREATE.fullPath);
            }}
            chainLabel={chainLabel}
          />
        ) : (
          <NotFound
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
      </DexCardBody>
    </>
  );
}

export default OffersPageSelectToChain;
