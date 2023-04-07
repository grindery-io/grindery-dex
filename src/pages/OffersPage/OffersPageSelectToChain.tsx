import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import { Box } from '@mui/system';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import DexCardHeader from '../../components/DexCard/DexCardHeader';
import ChainsList from '../../components/ChainsList/ChainsList';
import TokenSearch from '../../components/TokenSearch/TokenSearch';
import TokensList from '../../components/TokensList/TokensList';
import NotFound from '../../components/NotFound/NotFound';
import { useNavigate } from 'react-router-dom';
import DexCardBody from '../../components/DexCard/DexCardBody';
import { ChainType } from '../../types/ChainType';
import { useAppSelector } from '../../store/storeHooks';
import { selectChainsItems } from '../../store/slices/chainsSlice';
import { selectOffersCreateInput } from '../../store/slices/offersSlice';
import { useOffersController } from '../../controllers/OffersController';
import { getChainById } from '../../utils/helpers/chainHelpers';
import { getTokensByChain } from '../../utils/helpers/tokenHelpers';
import { TokenType } from '../../types/TokenType';
import { ROUTES } from '../../config/routes';

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
              navigate(ROUTES.SELL.OFFERS.CREATE.FULL_PATH);
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        }
        endAdornment={<Box width={28} height={40} />}
      />
      <DexCardBody>
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
      </DexCardBody>
    </>
  );
}

export default OffersPageSelectToChain;
