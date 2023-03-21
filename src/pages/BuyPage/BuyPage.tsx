import React from 'react';
import { Box } from '@mui/system';
import { Route, Routes } from 'react-router-dom';
import DexCard from '../../components/grindery/DexCard/DexCard';
import DexCardHeader from '../../components/grindery/DexCard/DexCardHeader';
import DexLoading from '../../components/grindery/DexLoading/DexLoading';
import DexPageContainer from '../../components/grindery/DexPageContainer/DexPageContainer';
import useBuyPage from '../../hooks/useBuyPage';
import BuyPageSearchOffers from './BuyPageSearchOffers';
import BuyPageSelectToChainAndToken from './BuyPageSelectToChainAndToken';
import DexCardBody from '../../components/grindery/DexCard/DexCardBody';
import DexTokensNotFound from '../../components/grindery/DexTokensNotFound/DexTokensNotFound';
import { Offer } from '../../types/Offer';
import useGrinderyChains from '../../hooks/useGrinderyChains';
import DexOfferPublic from '../../components/grindery/DexOffer/DexOfferPublic';
import BuyPageSelectFromChain from './BuyPageSelectFromChain';
import DexOfferSkeleton from '../../components/grindery/DexOffer/DexOfferSkeleton';
import { CircularProgress } from '@mui/material';

type Props = {};

const BuyPage = (props: Props) => {
  const { VIEWS, isOffersVisible, loading, foundOffers } = useBuyPage();
  const { chains } = useGrinderyChains();
  return (
    <div>
      <DexPageContainer>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="center"
          flexWrap="wrap"
          gap="20px"
        >
          <Box minWidth="375px">
            <Routes>
              <Route path={VIEWS.ROOT.path} element={<BuyPageSearchOffers />} />
              <Route
                path={VIEWS.SELECT_FROM_CHAIN.path}
                element={<BuyPageSelectFromChain />}
              />
              <Route
                path={VIEWS.SELECT_TO_CHAIN_TOKEN.path}
                element={<BuyPageSelectToChainAndToken />}
              />
            </Routes>
          </Box>

          <Box
            sx={{
              width: isOffersVisible ? '375px' : '0px',
              transformOrigin: 'left top',
              transform: isOffersVisible
                ? 'scaleX(1) scaleY(1)'
                : 'scaleX(0) scaleY(0)',
              opacity: isOffersVisible ? '1' : '0',
              transition: 'all 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
            }}
          >
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
                {loading &&
                  [1, 2, 3].map((i: number) => <DexOfferSkeleton key={i} />)}
                {!loading && foundOffers.length < 1 && (
                  <DexTokensNotFound
                    text={
                      <>
                        Offers not found. Please, try another chain, token or
                        change the amount.
                      </>
                    }
                  />
                )}
                {!loading &&
                  foundOffers.length > 0 &&
                  foundOffers.map((offer: Offer) => {
                    const offerChain = {
                      label:
                        chains.find((c) => c.value === `eip155:${offer.chain}`)
                          ?.label || '',
                      icon:
                        chains.find((c) => c.value === `eip155:${offer.chain}`)
                          ?.icon || '',
                      token:
                        chains.find((c) => c.value === `eip155:${offer.chain}`)
                          ?.nativeToken || '',
                    };
                    const currentOfferChain = chains.find(
                      (c) => c.value === `eip155:${offer.chain}`
                    );
                    const offerToken = {
                      label:
                        currentOfferChain?.tokens?.find(
                          (t) => t.id === offer.tokenId
                        )?.symbol || '',
                      icon:
                        currentOfferChain?.tokens?.find(
                          (t) => t.id === offer.tokenId
                        )?.icon || '',
                    };
                    return (
                      <DexOfferPublic
                        key={offer._id}
                        offer={offer}
                        chain={offerChain}
                        token={offerToken}
                      />
                    );
                  })}

                <Box height="10px" />
              </DexCardBody>
            </DexCard>
          </Box>
        </Box>
      </DexPageContainer>
    </div>
  );
};

export default BuyPage;
