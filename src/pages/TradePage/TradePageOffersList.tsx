import React from 'react';
import { Box } from '@mui/system';
import DexCard from '../../components/DexCard/DexCard';
import DexCardHeader from '../../components/DexCard/DexCardHeader';
import useTradePage from '../../hooks/useTradePage';
import DexCardBody from '../../components/DexCard/DexCardBody';
import NotFound from '../../components/NotFound/NotFound';
import { Offer } from '../../types/Offer';
import useGrinderyChains from '../../hooks/useGrinderyChains';
import OfferPublic from '../../components/Offer/OfferPublic';
import OfferSkeleton from '../../components/Offer/OfferSkeleton';
import { useNavigate } from 'react-router-dom';

type Props = {};

const TradePageOffersList = (props: Props) => {
  const {
    VIEWS,
    loading,
    foundOffers,
    fromAmount,
    toTokenPrice,
    fromTokenPrice,
  } = useTradePage();
  const { chains } = useGrinderyChains();
  let navigate = useNavigate();

  return (
    <DexCard>
      <DexCardHeader title="Offers" />
      <DexCardBody maxHeight="540px">
        {loading && [1, 2, 3].map((i: number) => <OfferSkeleton key={i} />)}
        {!loading && foundOffers.length < 1 && (
          <NotFound
            text={
              <>
                Offers not found. Please, try another chain, token or change the
                amount.
              </>
            }
          />
        )}
        {!loading &&
          foundOffers.length > 0 &&
          foundOffers.map((offer: Offer) => {
            const offerChain = chains.find(
              (c) => c.value === `eip155:${offer.chainId}`
            );
            const offerToken = offerChain?.tokens?.find(
              (t) => t.coinmarketcapId === offer.tokenId
            );
            return offerChain && offerToken ? (
              <OfferPublic
                key={offer._id}
                compact
                offer={offer}
                chain={offerChain}
                token={offerToken}
                fromAmount={fromAmount}
                onClick={(o: Offer) => {
                  navigate(
                    VIEWS.ACCEPT_OFFER.fullPath.replace(
                      ':offerId',
                      o.offerId || o._id
                    )
                  );
                }}
              />
            ) : null;
          })}

        <Box height="10px" />
      </DexCardBody>
    </DexCard>
  );
};

export default TradePageOffersList;
