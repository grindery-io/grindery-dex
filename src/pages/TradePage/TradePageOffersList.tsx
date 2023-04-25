import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/system';
import {
  OfferSkeleton,
  OfferPublic,
  NotFound,
  PageCard,
  PageCardHeader,
  PageCardBody,
} from '../../components';
import { OfferType } from '../../types';
import { ROUTES } from '../../config';
import {
  useAppSelector,
  selectTradeFilter,
  selectTradeLoading,
  selectTradeOffers,
  selectChainsItems,
  selectUserAdvancedMode,
} from '../../store';

type Props = {};

const TradePageOffersList = (props: Props) => {
  let navigate = useNavigate();
  const loading = useAppSelector(selectTradeLoading);
  const foundOffers = useAppSelector(selectTradeOffers);
  const { amount } = useAppSelector(selectTradeFilter);
  const chains = useAppSelector(selectChainsItems);
  const advancedMode = useAppSelector(selectUserAdvancedMode);

  return (
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
                navigate(
                  ROUTES.BUY.TRADE.ACCEPT_OFFER.FULL_PATH.replace(
                    ':offerId',
                    o.offerId || o._id
                  )
                );
              }}
            />
          ))}

        <Box height="10px" />
      </PageCardBody>
    </PageCard>
  );
};

export default TradePageOffersList;
