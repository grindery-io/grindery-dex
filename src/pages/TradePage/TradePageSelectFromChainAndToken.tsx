import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/system';
import { IconButton } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import {
  NotFound,
  TokensList,
  TokenSearch,
  ChainsList,
  PageCard,
  PageCardHeader,
  PageCardBody,
} from '../../components';
import { ChainType, TokenType } from '../../types';
import {
  useAppSelector,
  selectChainsStore,
  selectTradeStore,
} from '../../store';
import { filterBuyerChains, getChainById, getTokensByChain } from '../../utils';
import { useTradeProvider } from '../../providers';
import { ROUTES } from '../../config';

type Props = {};

const TradePageSelectFromChainAndToken = (props: Props) => {
  let navigate = useNavigate();
  const { items: chains, loading: chainsIsLoading } =
    useAppSelector(selectChainsStore);
  const { filter } = useAppSelector(selectTradeStore);
  const { fromChainId } = filter;
  const filteredChains = filterBuyerChains(chains);
  const fromChain = getChainById(fromChainId, chains);
  const chainTokens = getTokensByChain(fromChain);
  const { handleTradeFilterChange } = useTradeProvider();
  const [searchToken, setSearchToken] = useState('');
  const fromChainTokens = chainTokens.filter(
    (t: TokenType) =>
      !searchToken || t.symbol.toLowerCase().includes(searchToken.toLowerCase())
  );

  return (
    <PageCard>
      <PageCardHeader
        title="Select chain and token"
        titleSize={18}
        titleAlign="center"
        startAdornment={
          <IconButton
            size="medium"
            edge="start"
            onClick={() => {
              navigate(ROUTES.BUY.TRADE.ROOT.FULL_PATH);
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        }
        endAdornment={<Box width={28} height={40} />}
      />
      <PageCardBody>
        <ChainsList
          chain={fromChain?.value || ''}
          chains={filteredChains}
          onClick={(chain: ChainType) => {
            handleTradeFilterChange('fromChainId', chain.chainId);
            handleTradeFilterChange('fromTokenId', '');
          }}
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
            onClick={() => {}}
            loading={chainsIsLoading}
            chainLabel={fromChain?.label}
          />
        ) : (
          <>
            {fromChain && fromChainTokens && fromChainTokens.length > 0 ? (
              <TokensList
                tokens={fromChainTokens}
                onClick={(token: TokenType) => {
                  handleTradeFilterChange(
                    'fromTokenId',
                    token.coinmarketcapId || ''
                  );
                  navigate(ROUTES.BUY.TRADE.ROOT.FULL_PATH);
                }}
                loading={chainsIsLoading}
                chainLabel={fromChain?.label}
              />
            ) : (
              <NotFound
                text={
                  !fromChain ? (
                    <>Please, select a chain to see a list of tokens.</>
                  ) : (
                    <>
                      We couldn't find tokens{' '}
                      {fromChain ? `on ${fromChain?.label} chain` : ''}. Please
                      try search again or switch the chain.
                    </>
                  )
                }
              />
            )}
          </>
        )}

        <Box height="20px" />
      </PageCardBody>
    </PageCard>
  );
};

export default TradePageSelectFromChainAndToken;
