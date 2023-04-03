import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { useGrinderyNexus } from 'use-grindery-nexus';
import { AddCircleOutline as AddCircleOutlineIcon } from '@mui/icons-material';
import DexCardHeader from '../../components/DexCard/DexCardHeader';
import DexCardSubmitButton from '../../components/DexCard/DexCardSubmitButton';
import DexCardBody from '../../components/DexCard/DexCardBody';
import Loading from '../../components/Loading/Loading';
import { OfferType } from '../../types/OfferType';
import { Chain } from '../../types/Chain';
import { useNavigate } from 'react-router-dom';
import useGrinderyChains from '../../hooks/useGrinderyChains';
import useOffers from '../../hooks/useOffers';
import ListSubheader from '../../components/ListSubheader/ListSubheader';
import useOffersPage from '../../hooks/useOffersPage';
import _ from 'lodash';
import OfferPublic from '../../components/Offer/OfferPublic';
import { LiquidityWallet } from '../../types/LiquidityWallet';
import useLiquidityWallets from '../../hooks/useLiquidityWallets';
import OfferSkeleton from '../../components/Offer/OfferSkeleton';

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
  const { wallets } = useLiquidityWallets();

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
                      ).map((offer: OfferType) => {
                        const offerChain = chains.find(
                          (c) => c.value === `eip155:${offer.chainId}`
                        );
                        const offerToken = offerChain?.tokens?.find(
                          (t) => t.coinmarketcapId === offer.tokenId
                        );
                        return offerChain && offerToken ? (
                          <OfferPublic
                            key={offer._id}
                            compact
                            userType="b"
                            offer={offer}
                            chain={offerChain}
                            isActivating={isActivating}
                            onDeactivateClick={handleDeactivateClick}
                            onActivateClick={handleActivateClick}
                            token={offerToken}
                            defaultProvider={wallets.find(
                              (w: LiquidityWallet) =>
                                w.chainId === offer.chainId
                            )}
                          />
                        ) : null;
                      })}
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
