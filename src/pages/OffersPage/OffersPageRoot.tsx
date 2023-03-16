import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { useGrinderyNexus } from 'use-grindery-nexus';
import { AddCircleOutline as AddCircleOutlineIcon } from '@mui/icons-material';
import DexCardHeader from '../../components/grindery/DexCard/DexCardHeader';
import DexOffer from '../../components/grindery/DexOffer/DexOffer';
import DexCardSubmitButton from '../../components/grindery/DexCard/DexCardSubmitButton';
import DexCardBody from '../../components/grindery/DexCard/DexCardBody';
import DexLoading from '../../components/grindery/DexLoading/DexLoading';
import { Offer } from '../../types/Offer';
import { Chain } from '../../types/Chain';
import { useNavigate } from 'react-router-dom';
import useGrinderyChains from '../../hooks/useGrinderyChains';
import useOffers from '../../hooks/useOffers';
import DexListSubheader from '../../components/grindery/DexListSubheader/DexListSubheader';
import useOffersPage from '../../hooks/useOffersPage';

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
              <DexListSubheader>
                {chains.find((c: Chain) => c.value === `eip155:${key}`)
                  ?.label || ''}
              </DexListSubheader>
              {groupedOffers[key].map((offer: Offer) => {
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
                  <DexOffer
                    key={offer._id}
                    offer={offer}
                    chain={offerChain}
                    isActivating={isActivating}
                    onDeactivateClick={handleDeactivateClick}
                    onActivateClick={handleActivateClick}
                    token={offerToken}
                  />
                );
              })}
            </React.Fragment>
          ))}
        {user && offersIsLoading && <DexLoading />}
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
