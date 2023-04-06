import React from 'react';
import { Box } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import DexCard from '../../components/DexCard/DexCard';
import DexCardBody from '../../components/DexCard/DexCardBody';
import DexCardHeader from '../../components/DexCard/DexCardHeader';
import { IconButton } from '@mui/material';
import useTradePage from '../../hooks/useTradePage';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import ChainsList from '../../components/ChainsList/ChainsList';
import TokenSearch from '../../components/TokenSearch/TokenSearch';
import TokensList from '../../components/TokensList/TokensList';
import NotFound from '../../components/NotFound/NotFound';
import { ChainType } from '../../types/ChainType';
import { useAppSelector } from '../../store/storeHooks';
import {
  selectChainsItems,
  selectChainsLoading,
} from '../../store/slices/chainsSlice';

type Props = {};

const TradePageSelectChainAndToken = (props: Props) => {
  const {
    VIEWS,
    searchToken,
    setSearchToken,
    toChain,
    handleToChainChange,
    toChainTokens,
    currentToChain,
    handleToTokenChange,
  } = useTradePage();
  const chains = useAppSelector(selectChainsItems);
  const chainsIsLoading = useAppSelector(selectChainsLoading);
  let navigate = useNavigate();
  const filteredChains = chains.filter(
    (c: ChainType) => c.value === 'eip155:97'
  );
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
          chain={toChain?.value || ''}
          chains={filteredChains}
          onClick={handleToChainChange}
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
            tokens={toChainTokens}
            onClick={handleToTokenChange}
            loading={chainsIsLoading}
            chainLabel={toChain?.label}
          />
        ) : (
          <>
            {currentToChain && toChainTokens && toChainTokens.length > 0 ? (
              <TokensList
                tokens={toChainTokens}
                onClick={handleToTokenChange}
                loading={chainsIsLoading}
                chainLabel={toChain?.label}
              />
            ) : (
              <NotFound
                text={
                  !currentToChain ? (
                    <>Please, select a chain to see a list of tokens.</>
                  ) : (
                    <>
                      We couldn't find tokens{' '}
                      {currentToChain
                        ? `on ${currentToChain?.label} chain`
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

export default TradePageSelectChainAndToken;
