import React, { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Box } from '@mui/system';
import {
  OfferSkeleton,
  OfferPublic,
  NotFound,
  PageCard,
  PageCardHeader,
  PageCardBody,
  ConnectWalletModal,
} from '../../components';
import { OfferType } from '../../types';
import {
  useAppSelector,
  selectTradeFilter,
  selectTradeLoading,
  selectTradeOffers,
  selectChainsItems,
  selectUserAdvancedMode,
  selectUserAccessToken,
  selectTradeOffersHasMore,
} from '../../store';
import { useTradeProvider, useUserProvider } from '../../providers';

type Props = {};

const TradePageOffersList = (props: Props) => {
  const { connectUser } = useUserProvider();
  const accessToken = useAppSelector(selectUserAccessToken);
  const loading = useAppSelector(selectTradeLoading);
  const foundOffers = useAppSelector(selectTradeOffers);
  const { amount } = useAppSelector(selectTradeFilter);
  const chains = useAppSelector(selectChainsItems);
  const advancedMode = useAppSelector(selectUserAdvancedMode);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const { handleAcceptOfferAction, handleSearchMoreOffersAction } =
    useTradeProvider();
  const hasMore = useAppSelector(selectTradeOffersHasMore);

  return (
    <>
      {!accessToken && (
        <ConnectWalletModal
          open={showWalletModal}
          onClose={() => {
            setShowWalletModal(false);
          }}
          onConnect={() => {
            connectUser();
          }}
        />
      )}
      <PageCard>
        <PageCardHeader title="Offers" />
        <PageCardBody maxHeight="540px" id="offers-list">
          {!loading && foundOffers.length < 1 && (
            <NotFound
              text={
                <>
                  No offers found. Try 0.01 Goerli ETH. For support{' '}
                  <a
                    style={{ color: '#3f49e1' }}
                    href="https://discord.gg/PCMTWg3KzE"
                    target="_blank"
                    rel="noreferrer"
                  >
                    visit our Discord
                  </a>
                  .
                </>
              }
            />
          )}
          {loading ? (
            <OfferSkeleton />
          ) : (
            <InfiniteScroll
              dataLength={foundOffers.length}
              next={handleSearchMoreOffersAction}
              hasMore={hasMore}
              loader={<OfferSkeleton />}
              scrollableTarget="offers-list"
            >
              {foundOffers.map((offer: OfferType) => (
                <OfferPublic
                  key={offer._id}
                  chains={chains}
                  compact
                  offer={offer}
                  fromAmount={amount}
                  advancedMode={advancedMode}
                  onClick={(_offer: OfferType) => {
                    if (!accessToken) {
                      setShowWalletModal(true);
                    } else {
                      handleAcceptOfferAction(_offer);
                    }
                  }}
                />
              ))}
            </InfiniteScroll>
          )}
          <Box height="10px" />
        </PageCardBody>
      </PageCard>
    </>
  );
};

export default TradePageOffersList;
