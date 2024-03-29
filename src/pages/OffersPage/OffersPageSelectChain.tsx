import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import { Box } from '@mui/system';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import {
  NotFound,
  ChainsList,
  TokenSearch,
  TokensList,
  PageCardHeader,
  PageCardBody,
} from '../../components';
import { ChainType, TokenType } from '../../types';
import {
  useAppSelector,
  selectChainsStore,
  selectOffersStore,
} from '../../store';
import { getChainById } from '../../utils';
import { useOffersProvider } from '../../providers';
import { ROUTES } from '../../config';
import { getTokensByChain } from '../../utils';

function OffersPageSelectChain() {
  let navigate = useNavigate();
  const { items: chains } = useAppSelector(selectChainsStore);
  const { input } = useAppSelector(selectOffersStore);
  const { fromChainId } = input;
  const { handleOfferCreateInputChange } = useOffersProvider();
  const [searchToken, setSearchToken] = useState('');
  const fromChain = getChainById(fromChainId, chains);
  const chainLabel = fromChain?.label;
  const chainTokens = getTokensByChain(fromChain).filter(
    (t: TokenType) =>
      !searchToken || t.symbol.toLowerCase().includes(searchToken)
  );

  return (
    <>
      <PageCardHeader
        title="Select chain and token"
        titleSize={18}
        titleAlign="center"
        startAdornment={
          <IconButton
            id="back-button"
            size="medium"
            edge="start"
            onClick={() => {
              setSearchToken('');
              navigate(ROUTES.SELL.OFFERS.CREATE.FULL_PATH);
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        }
        endAdornment={<Box width={28} height={40} />}
      />
      <PageCardBody>
        <ChainsList
          chain={fromChainId}
          chains={chains}
          onClick={(blockchain: ChainType) => {
            handleOfferCreateInputChange('fromChainId', blockchain.chainId);
            handleOfferCreateInputChange('fromTokenId', '');
          }}
        />
        <TokenSearch
          value={searchToken}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setSearchToken(event.target.value);
          }}
        />

        {fromChainId && chainTokens && chainTokens.length > 0 ? (
          <TokensList
            tokens={chainTokens}
            onClick={(chainToken: any) => {
              handleOfferCreateInputChange(
                'fromTokenId',
                chainToken.coinmarketcapId
              );
              setSearchToken('');
              navigate(ROUTES.SELL.OFFERS.CREATE.FULL_PATH);
            }}
            chainLabel={chainLabel}
          />
        ) : (
          <NotFound
            text={
              !fromChain ? (
                <>Please, select a chain to see a list of tokens.</>
              ) : (
                <>
                  We couldn't find tokens{' '}
                  {fromChain ? `on ${fromChain?.label} chain` : ''}. Please try
                  search again or switch the chain.
                </>
              )
            }
          />
        )}
      </PageCardBody>
    </>
  );
}

export default OffersPageSelectChain;
