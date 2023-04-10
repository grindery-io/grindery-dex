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
  selectChainsItems,
  selectChainsLoading,
  selectTradeFilter,
} from '../../store';
import { getChainById, getTokensByChain } from '../../utils';
import { useTradeController } from '../../controllers';
import { ROUTES } from '../../config';

type Props = {};

const TradePageSelectChainAndToken = (props: Props) => {
  let navigate = useNavigate();
  const chains = useAppSelector(selectChainsItems);
  const chainsIsLoading = useAppSelector(selectChainsLoading);
  const filteredChains = chains.filter(
    (c: ChainType) => c.value === 'eip155:97'
  );
  const filter = useAppSelector(selectTradeFilter);
  const { toChainId } = filter;
  const toChain = getChainById(toChainId, chains);
  const chainTokens = getTokensByChain(toChain);
  const { handleTradeFilterChange } = useTradeController();
  const [searchToken, setSearchToken] = useState('');
  const toChainTokens = chainTokens.filter(
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
          chain={toChain?.value || ''}
          chains={filteredChains}
          onClick={(chain: ChainType) => {
            handleTradeFilterChange('toChainId', chain.chainId);
            handleTradeFilterChange('toTokenId', '');
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
            tokens={toChainTokens}
            onClick={() => {}}
            loading={chainsIsLoading}
            chainLabel={toChain?.label}
          />
        ) : (
          <>
            {toChain && toChainTokens && toChainTokens.length > 0 ? (
              <TokensList
                tokens={toChainTokens}
                onClick={(token: TokenType) => {
                  handleTradeFilterChange(
                    'toTokenId',
                    token.coinmarketcapId || ''
                  );
                  navigate(ROUTES.BUY.TRADE.ROOT.FULL_PATH);
                }}
                loading={chainsIsLoading}
                chainLabel={toChain?.label}
              />
            ) : (
              <NotFound
                text={
                  !toChain ? (
                    <>Please, select a chain to see a list of tokens.</>
                  ) : (
                    <>
                      We couldn't find tokens{' '}
                      {toChain ? `on ${toChain?.label} chain` : ''}. Please try
                      search again or switch the chain.
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

export default TradePageSelectChainAndToken;
