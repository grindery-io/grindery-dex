import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, IconButton, Tooltip } from '@mui/material';
import { AddCircleOutline as AddCircleOutlineIcon } from '@mui/icons-material';
import {
  ListSubheader,
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
} from '../../store';
import { useUserController, useOffersController } from '../../controllers';
import { ROUTES } from '../../config';
import { OfferType } from '../../types';
import {
  groupOffersByChainId,
  orderOffersByActiveState,
  getChainById,
} from '../../utils';

function OffersPageRoot() {
  const user = useAppSelector(selectUserId);
  const { connectUser: connect } = useUserController();
  const isActivating = useAppSelector(selectOffersActivating);
  const { handleActivationAction } = useOffersController();
  let navigate = useNavigate();
  const chains = useAppSelector(selectChainsItems);
  const offers = useAppSelector(selectOffersItems);
  const offersIsLoading = useAppSelector(selectOffersLoading);
  const groupedOffers = groupOffersByChainId(offers);

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

      <PageCardBody maxHeight="540px">
        {user && (
          <>
            {offers.length < 1 && offersIsLoading ? (
              <>
                {[0, 1].map((i: number) => (
                  <OfferSkeleton key={i} />
                ))}
              </>
            ) : (
              <>
                <Box className="offers-list">
                  {offers.length > 0 &&
                    Object.keys(groupedOffers).map((key: any) => (
                      <Box key={key}>
                        <ListSubheader>
                          {getChainById(key, chains)?.label || ''}
                        </ListSubheader>
                        {orderOffersByActiveState(groupedOffers[key]).map(
                          (offer: OfferType) => (
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
                          )
                        )}
                      </Box>
                    ))}
                </Box>
              </>
            )}
          </>
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
