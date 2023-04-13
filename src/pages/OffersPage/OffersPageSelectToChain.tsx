import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import { Box } from '@mui/system';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import {
  NotFound,
  TokensList,
  TokenSearch,
  ChainsList,
  PageCardHeader,
  PageCardBody,
} from '../../components';
import { ChainType, TokenType } from '../../types';
import {
  useAppSelector,
  selectChainsItems,
  selectOffersCreateInput,
} from '../../store';
import { useOffersController } from '../../controllers';
import { getChainById, getTokensByChain } from '../../utils';
import { ROUTES } from '../../config';

function OffersPageSelectToChain() {
  let navigate = useNavigate();
  const chains = useAppSelector(selectChainsItems);
  const input = useAppSelector(selectOffersCreateInput);
  const { toChainId } = input;
  const { handleOfferCreateInputChange } = useOffersController();
  const [searchToken, setSearchToken] = useState('');
  const toChain = getChainById(toChainId, chains);
  const chainLabel = toChain?.label;
  const chainTokens = getTokensByChain(toChain).filter(
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
          chain={toChainId}
          chains={chains.filter((c: ChainType) => c.chainId === '5')}
          onClick={(blockchain: ChainType) => {
            handleOfferCreateInputChange('toChainId', blockchain.chainId);
            handleOfferCreateInputChange('toTokenId', '');
          }}
        />
        <TokenSearch
          value={searchToken}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setSearchToken(event.target.value);
          }}
        />

        {toChain && chainTokens && chainTokens.length > 0 ? (
          <TokensList
            tokens={chainTokens}
            onClick={(chainToken: any) => {
              handleOfferCreateInputChange(
                'toTokenId',
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
      </PageCardBody>
    </>
  );
}

export default OffersPageSelectToChain;
