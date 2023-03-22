import React from 'react';
import { Box } from '@mui/system';
import DexCard from '../../components/grindery/DexCard/DexCard';
import DexCardHeader from '../../components/grindery/DexCard/DexCardHeader';
import DexLoading from '../../components/grindery/DexLoading/DexLoading';
import useBuyPage from '../../hooks/useBuyPage';
import DexCardBody from '../../components/grindery/DexCard/DexCardBody';
import DexTokensNotFound from '../../components/grindery/DexTokensNotFound/DexTokensNotFound';
import { Offer } from '../../types/Offer';
import useGrinderyChains from '../../hooks/useGrinderyChains';
import DexOfferPublic from '../../components/grindery/DexOffer/DexOfferPublic';
import DexOfferSkeleton from '../../components/grindery/DexOffer/DexOfferSkeleton';
import { useNavigate } from 'react-router-dom';

type Props = {};

const BuyPageOffersList = (props: Props) => {
  const { VIEWS, loading, foundOffers, fromAmount, toTokenPrice } =
    useBuyPage();
  const { chains } = useGrinderyChains();
  let navigate = useNavigate();
  return (
    <DexCard>
      <DexCardHeader
        title="Offers"
        endAdornment={
          loading ? (
            <Box ml="auto">
              <DexLoading size={20} style={{ margin: '0' }} />
            </Box>
          ) : undefined
        }
      />
      <DexCardBody maxHeight="540px">
        {loading && [1, 2, 3].map((i: number) => <DexOfferSkeleton key={i} />)}
        {!loading && foundOffers.length < 1 && (
          <DexTokensNotFound
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
            const offerChain = {
              label:
                chains.find((c) => c.value === `eip155:${offer.chainId}`)
                  ?.label || '',
              icon:
                chains.find((c) => c.value === `eip155:${offer.chainId}`)
                  ?.icon || '',
              token:
                chains.find((c) => c.value === `eip155:${offer.chainId}`)
                  ?.nativeToken || '',
            };
            const currentOfferChain = chains.find(
              (c) => c.value === `eip155:${offer.chainId}`
            );
            const offerToken = {
              label:
                currentOfferChain?.tokens?.find((t) => t.id === offer.tokenId)
                  ?.symbol || '',
              icon:
                currentOfferChain?.tokens?.find((t) => t.id === offer.tokenId)
                  ?.icon || '',
            };
            return (
              <DexOfferPublic
                key={offer._id}
                offer={offer}
                chain={offerChain}
                token={offerToken}
                grt={fromAmount}
                tokenPrice={toTokenPrice}
                onClick={(o: Offer) => {
                  navigate(
                    VIEWS.ACCEPT_OFFER.fullPath.replace(
                      ':offerId',
                      o.offerId || o._id
                    )
                  );
                }}
              />
            );
          })}

        <Box height="10px" />
      </DexCardBody>
    </DexCard>
  );
};

export default BuyPageOffersList;
