import React, { useEffect, useState } from 'react';
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
