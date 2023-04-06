import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { useGrinderyNexus } from 'use-grindery-nexus';
import { AddCircleOutline as AddCircleOutlineIcon } from '@mui/icons-material';
import DexCardHeader from '../../components/DexCard/DexCardHeader';
import DexCardSubmitButton from '../../components/DexCard/DexCardSubmitButton';
import DexCardBody from '../../components/DexCard/DexCardBody';
import { Chain } from '../../types/Chain';
import { useNavigate } from 'react-router-dom';
import useOffers from '../../hooks/useOffers';
import ListSubheader from '../../components/ListSubheader/ListSubheader';
import useOffersPage from '../../hooks/useOffersPage';
import _ from 'lodash';
import OfferPublic from '../../components/Offer/OfferPublic';
import OfferSkeleton from '../../components/Offer/OfferSkeleton';
import Offer from '../../models/Offer';
import { useAppSelector } from '../../store/storeHooks';
import { selectChainsItems } from '../../store/slices/chainsSlice';

function OffersPageRoot() {
  const { user, connect } = useGrinderyNexus();
  const {
    isActivating,
    groupedOffers,
    handleDeactivateClick,
    handleActivateClick,
    VIEWS,
  } = useOffersPage();
  let navigate = useNavigate();

  const chains = useAppSelector(selectChainsItems);
  const { offers, isLoading: offersIsLoading } = useOffers();

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
                  navigate(VIEWS.CREATE.fullPath);
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
            {offersIsLoading ? (
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
                        {chains.find((c: Chain) => c.value === `eip155:${key}`)
                          ?.label || ''}
                      </ListSubheader>
                      {_.orderBy(
                        groupedOffers[key],
                        ['isActive'],
                        ['desc']
                      ).map((offer: Offer) => (
                        <OfferPublic
                          key={offer._id}
                          compact
                          userType="b"
                          offer={offer}
                          isActivating={isActivating}
                          onDeactivateClick={handleDeactivateClick}
                          onActivateClick={handleActivateClick}
                        />
                      ))}
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
                  navigate(VIEWS.CREATE.fullPath);
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
