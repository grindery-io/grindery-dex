import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { AddCircleOutline as AddCircleOutlineIcon } from '@mui/icons-material';
import DexCardHeader from '../../components/DexCard/DexCardHeader';
import DexCardSubmitButton from '../../components/DexCard/DexCardSubmitButton';
import DexCardBody from '../../components/DexCard/DexCardBody';
import { useNavigate } from 'react-router-dom';
import ListSubheader from '../../components/ListSubheader/ListSubheader';
import _ from 'lodash';
import OfferPublic from '../../components/Offer/OfferPublic';
import OfferSkeleton from '../../components/Offer/OfferSkeleton';
import { useAppSelector } from '../../store/storeHooks';
import { selectChainsItems } from '../../store/slices/chainsSlice';
import {
  selectOffersActivating,
  selectOffersItems,
  selectOffersLoading,
} from '../../store/slices/offersSlice';
import {
  selectUserAccessToken,
  selectUserChainId,
  selectUserId,
} from '../../store/slices/userSlice';
import { useUserController } from '../../controllers/UserController';
import { ROUTES } from '../../config/routes';
import { useOffersController } from '../../controllers/OffersController';
import { selectPoolAbi } from '../../store/slices/abiSlice';
import { OfferType } from '../../types/OfferType';
import {
  groupOffersByChainId,
  orderOffersByActiveState,
} from '../../utils/helpers/offerHelpers';
import { getChainById } from '../../utils/helpers/chainHelpers';

function OffersPageRoot() {
  const user = useAppSelector(selectUserId);
  const { connectUser: connect } = useUserController();
  const accessToken = useAppSelector(selectUserAccessToken);
  const userChain = useAppSelector(selectUserChainId);
  const isActivating = useAppSelector(selectOffersActivating);
  const { handleActivationAction } = useOffersController();
  let navigate = useNavigate();
  const chains = useAppSelector(selectChainsItems);
  const offers = useAppSelector(selectOffersItems);
  const offersIsLoading = useAppSelector(selectOffersLoading);
  const poolAbi = useAppSelector(selectPoolAbi);
  const groupedOffers = groupOffersByChainId(offers);

  return (
    <>
      <DexCardHeader
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

      <DexCardBody maxHeight="540px">
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
                {offers.length > 0 &&
                  Object.keys(groupedOffers).map((key: any) => (
                    <React.Fragment key={key}>
                      <ListSubheader>
                        {getChainById(key, chains)?.label || ''}
                      </ListSubheader>
                      {orderOffersByActiveState(groupedOffers[key]).map(
                        (offer: OfferType) => (
                          <OfferPublic
                            key={offer._id}
                            compact
                            userType="b"
                            offer={offer}
                            isActivating={isActivating}
                            onDeactivateClick={() => {
                              handleActivationAction(
                                accessToken,
                                offer,
                                false,
                                userChain,
                                chains,
                                poolAbi
                              );
                            }}
                            onActivateClick={() => {
                              handleActivationAction(
                                accessToken,
                                offer,
                                true,
                                userChain,
                                chains,
                                poolAbi
                              );
                            }}
                          />
                        )
                      )}
                    </React.Fragment>
                  ))}
              </>
            )}
          </>
        )}

        <DexCardSubmitButton
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
      </DexCardBody>
    </>
  );
}

export default OffersPageRoot;
