import React from 'react';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Box, IconButton, Tooltip } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  Loading,
  NotFound,
  Offer,
  OfferSkeleton,
  PageCardBody,
  PageCardHeader,
  PageCardSubmitButton,
} from '../../components';
import {
  useAppSelector,
  selectChainsStore,
  selectOffersStore,
  selectUserStore,
} from '../../store';
import { useUserProvider, useOffersProvider } from '../../providers';
import { ROUTES } from '../../config';
import { OfferType } from '../../types';

function OffersPageRoot() {
  const { id: user } = useAppSelector(selectUserStore);
  const { connectUser: connect } = useUserProvider();
  const {
    handleActivationAction,
    handleFetchMoreOffersAction,
    handleOffersRefreshAction,
  } = useOffersProvider();
  let navigate = useNavigate();
  const { items: chains } = useAppSelector(selectChainsStore);
  const {
    items: offers,
    loading: offersIsLoading,
    total,
    activating: isActivating,
    refreshing,
  } = useAppSelector(selectOffersStore);
  const hasMore = offers.length < total;

  return (
    <>
      <PageCardHeader
        title="Offers"
        endAdornment={
          user && offers.length > 0 ? (
            <Tooltip title={refreshing ? 'Loading...' : 'Refresh'}>
              <div>
                {refreshing ? (
                  <Loading
                    style={{
                      width: 'auto',
                      margin: 0,
                      padding: '8px 0 8px 8px',
                    }}
                    progressStyle={{
                      width: '20px !important',
                      height: '20px !important',
                    }}
                  />
                ) : (
                  <IconButton
                    size="medium"
                    edge="end"
                    onClick={() => {
                      handleOffersRefreshAction();
                    }}
                  >
                    <RefreshIcon sx={{ color: 'black' }} />
                  </IconButton>
                )}
              </div>
            </Tooltip>
          ) : null
        }
      />

      <PageCardBody maxHeight="540px" id="offers-list">
        {!offersIsLoading && offers.length < 1 && (
          <NotFound text="No offers found" />
        )}
        {offersIsLoading ? (
          <OfferSkeleton />
        ) : (
          <InfiniteScroll
            dataLength={offers.length}
            next={handleFetchMoreOffersAction}
            hasMore={hasMore}
            loader={<OfferSkeleton />}
            scrollableTarget="offers-list"
          >
            <Box className="offers-list">
              {offers.map((offer: OfferType) => (
                <Offer
                  key={offer._id}
                  chains={chains}
                  compact
                  offer={offer}
                  isActivating={isActivating}
                  onDeactivateClick={() => {
                    handleActivationAction(offer, false);
                  }}
                  onActivateClick={() => {
                    handleActivationAction(offer, true);
                  }}
                />
              ))}
            </Box>
          </InfiniteScroll>
        )}
        <PageCardSubmitButton
          label={user ? 'Create offer' : 'Connect wallet'}
          onClick={
            user
              ? () => {
                  navigate(ROUTES.SELL.OFFERS.CREATE.FULL_PATH);
                }
              : () => {
                  connect();
                }
          }
        />
      </PageCardBody>
    </>
  );
}

export default OffersPageRoot;
