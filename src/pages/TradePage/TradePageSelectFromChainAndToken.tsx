import React, { useState } from 'react';
import { Box } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import DexCard from '../../components/DexCard/DexCard';
import DexCardBody from '../../components/DexCard/DexCardBody';
import DexCardHeader from '../../components/DexCard/DexCardHeader';
import { IconButton } from '@mui/material';
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
import { ROUTES } from '../../config/routes';
import { selectTradeFilter } from '../../store/slices/tradeSlice';
import { getChainById } from '../../utils/helpers/chainHelpers';
import { getTokensByChain } from '../../utils/helpers/tokenHelpers';
import { useTradeController } from '../../controllers/TradeController';
import { TokenType } from '../../types/TokenType';

type Props = {};

const TradePageSelectFromChainAndToken = (props: Props) => {
  let navigate = useNavigate();
  const chains = useAppSelector(selectChainsItems);
  const filter = useAppSelector(selectTradeFilter);
  const { fromChainId } = filter;
  const fromChain = getChainById(fromChainId, chains);
  const chainTokens = getTokensByChain(fromChain);
  const { handleTradeFilterChange } = useTradeController();
  const [searchToken, setSearchToken] = useState('');
  const chainsIsLoading = useAppSelector(selectChainsLoading);
  const filteredChains = chains.filter(
    (c: ChainType) => c.value === 'eip155:5'
  );
  const fromChainTokens = chainTokens.filter(
    (t: TokenType) =>
      !searchToken || t.symbol.toLowerCase().includes(searchToken.toLowerCase())
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
              navigate(ROUTES.BUY.TRADE.ROOT.FULL_PATH);
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
      </DexCardBody>
    </DexCard>
  );
};

export default TradePageSelectFromChainAndToken;
