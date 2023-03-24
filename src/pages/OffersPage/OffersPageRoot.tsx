import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { useGrinderyNexus } from 'use-grindery-nexus';
import { AddCircleOutline as AddCircleOutlineIcon } from '@mui/icons-material';
import DexCardHeader from '../../components/DexCard/DexCardHeader';
import Offer from '../../components/Offer/Offer';
import DexCardSubmitButton from '../../components/DexCard/DexCardSubmitButton';
import DexCardBody from '../../components/DexCard/DexCardBody';
import Loading from '../../components/Loading/Loading';
import { Offer as OfferType } from '../../types/Offer';
import { Chain } from '../../types/Chain';
import { useNavigate } from 'react-router-dom';
import useGrinderyChains from '../../hooks/useGrinderyChains';
import useOffers from '../../hooks/useOffers';
import ListSubheader from '../../components/ListSubheader/ListSubheader';
import useOffersPage from '../../hooks/useOffersPage';
import _ from 'lodash';

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

  const { chains } = useGrinderyChains();
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
        {user &&
          offers.length > 0 &&
          Object.keys(groupedOffers).map((key: any) => (
            <React.Fragment key={key}>
              <ListSubheader>
                {chains.find((c: Chain) => c.value === `eip155:${key}`)
                  ?.label || ''}
              </ListSubheader>
              {_.orderBy(groupedOffers[key], ['isActive'], ['desc']).map(
                (offer: OfferType) => {
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
                      currentOfferChain?.tokens?.find(
                        (t) => t.id === offer.tokenId
                      )?.symbol || '',
                    icon:
                      currentOfferChain?.tokens?.find(
                        (t) => t.id === offer.tokenId
                      )?.icon || '',
                  };
                  return (
                    <Offer
                      key={offer._id}
                      offer={offer}
                      chain={offerChain}
                      isActivating={isActivating}
                      onDeactivateClick={handleDeactivateClick}
                      onActivateClick={handleActivateClick}
                      token={offerToken}
                    />
                  );
                }
              )}
            </React.Fragment>
          ))}
        {user && offersIsLoading && <Loading />}
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
