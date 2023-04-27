import React, { useState } from 'react';
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
  selectUserChainId,
  selectUserAddress,
  selectPoolAbi,
} from '../../store';
import { useTradeController, useUserController } from '../../controllers';
import { getTokenBySymbol } from '../../utils';

type Props = {};

const TradePageOffersList = (props: Props) => {
  const { connectUser } = useUserController();
  const accessToken = useAppSelector(selectUserAccessToken);
  const loading = useAppSelector(selectTradeLoading);
  const foundOffers = useAppSelector(selectTradeOffers);
  const { amount } = useAppSelector(selectTradeFilter);
  const chains = useAppSelector(selectChainsItems);
  const advancedMode = useAppSelector(selectUserAdvancedMode);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const userChainId = useAppSelector(selectUserChainId);
  const userAddress = useAppSelector(selectUserAddress);
  const poolAbi = useAppSelector(selectPoolAbi);
  const { handleAcceptOfferAction } = useTradeController();

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
        <PageCardBody maxHeight="540px">
          {loading && [1, 2, 3].map((i: number) => <OfferSkeleton key={i} />)}
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
          {!loading &&
            foundOffers.length > 0 &&
            foundOffers.map((offer: OfferType) => (
              <OfferPublic
                key={offer._id}
                chains={chains}
                compact
                offer={offer}
                fromAmount={amount}
                advancedMode={advancedMode}
                onClick={(o: OfferType) => {
                  if (!accessToken) {
                    setShowWalletModal(true);
                  } else {
                    const exchangeToken = getTokenBySymbol(
                      offer?.exchangeToken || '',
                      offer?.exchangeChainId || '',
                      chains
                    );
                    if (exchangeToken) {
                      handleAcceptOfferAction(
                        offer,
                        accessToken,
                        userChainId,
                        exchangeToken,
                        poolAbi,
                        userAddress,
                        amount,
                        chains
                      );
                    }
                  }
                }}
              />
            ))}

          <Box height="10px" />
        </PageCardBody>
      </PageCard>
    </>
  );
};

export default TradePageOffersList;
