import React from 'react';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Box, IconButton, Tooltip } from '@mui/material';
import { AddCircleOutline as AddCircleOutlineIcon } from '@mui/icons-material';
import {
  NotFound,
  Offer,
  OfferSkeleton,
  PageCardBody,
  PageCardHeader,
  PageCardSubmitButton,
} from '../../components';
import {
  useAppSelector,
  selectChainsItems,
  selectOffersActivating,
  selectOffersItems,
  selectOffersLoading,
  selectUserId,
  selectOffersHasMore,
} from '../../store';
import { useUserProvider, useOffersProvider } from '../../providers';
import { ROUTES } from '../../config';
import { OfferType } from '../../types';

function OffersPageRoot() {
  const user = useAppSelector(selectUserId);
  const { connectUser: connect } = useUserProvider();
  const isActivating = useAppSelector(selectOffersActivating);
  const { handleActivationAction, handleFetchMoreOffersAction } =
    useOffersProvider();
  let navigate = useNavigate();
  const chains = useAppSelector(selectChainsItems);
  const offers = useAppSelector(selectOffersItems);
  const offersIsLoading = useAppSelector(selectOffersLoading);
  const hasMore = useAppSelector(selectOffersHasMore);

  return (
    <>
      <PageCardHeader
        title="Offers"
        endAdornment={
          user && offers.length > 4 ? (
            <Tooltip title="Create">
              <IconButton
                size="medium"
                edge="end"
                onClick={() => {
                  navigate(ROUTES.SELL.OFFERS.CREATE.FULL_PATH);
                }}
              >
                <AddCircleOutlineIcon sx={{ color: 'black' }} />
              </IconButton>
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
