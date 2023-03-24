import React, { useEffect, useState } from 'react';
import { Box } from '@mui/system';
import DexCard from '../../components/DexCard/DexCard';
import DexCardHeader from '../../components/DexCard/DexCardHeader';
import Loading from '../../components/Loading/Loading';
import useBuyPage from '../../hooks/useBuyPage';
import DexCardBody from '../../components/DexCard/DexCardBody';
import NotFound from '../../components/NotFound/NotFound';
import { Offer } from '../../types/Offer';
import useGrinderyChains from '../../hooks/useGrinderyChains';
import OfferPublic from '../../components/Offer/OfferPublic';
import OfferSkeleton from '../../components/Offer/OfferSkeleton';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, IconButton, Tooltip } from '@mui/material';

type Props = {};

const BuyPageOffersList = (props: Props) => {
  const {
    VIEWS,
    loading,
    foundOffers,
    fromAmount,
    toTokenPrice,
    fromTokenPrice,
    isPricesLoading,
    handleRefreshOffersClick,
  } = useBuyPage();
  const { chains } = useGrinderyChains();
  let navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((_progress) => (_progress >= 100 ? 0 : _progress + 100 / 60));
    }, 1000);

    return () => {
      clearInterval(timer);
      setProgress(0);
    };
  }, []);

  useEffect(() => {
    if (progress === 0 && !loading) {
      handleRefreshOffersClick();
    }
  }, [progress, loading]);

  return (
    <DexCard>
      <DexCardHeader
        title="Offers"
        endAdornment={
          <Box ml="auto">
            <Tooltip title={isPricesLoading ? 'Refreshing...' : 'Refresh'}>
              <IconButton
                sx={{ marginRight: '-8px', position: 'realtive' }}
                onClick={() => {
                  setProgress(0);
                }}
              >
                <CircularProgress
                  size={20}
                  variant="determinate"
                  value={100}
                  sx={{
                    color: 'rgba(0,0,0,0.1)',
                  }}
                />
                <CircularProgress
                  size={20}
                  variant={isPricesLoading ? undefined : 'determinate'}
                  value={isPricesLoading ? undefined : progress}
                  sx={{
                    color: '#3f49e1',
                    position: 'absolute',
                    left: '8px',
                    top: '8px',
                    zIndex: 2,
                  }}
                />
              </IconButton>
            </Tooltip>
          </Box>
        }
      />
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
              <OfferPublic
                key={offer._id}
                offer={offer}
                chain={offerChain}
                token={offerToken}
                fromAmount={fromAmount}
                toTokenPrice={toTokenPrice}
                fromTokenPrice={fromTokenPrice}
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
