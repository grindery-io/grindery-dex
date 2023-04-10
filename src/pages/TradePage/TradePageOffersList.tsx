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
} from '../../store';

type Props = {};

const TradePageOffersList = (props: Props) => {
  let navigate = useNavigate();
  const loading = useAppSelector(selectTradeLoading);
  const foundOffers = useAppSelector(selectTradeOffers);
  const { amount } = useAppSelector(selectTradeFilter);

  return (
    <PageCard>
      <PageCardHeader title="Offers" />
      <PageCardBody maxHeight="540px">
        {loading && [1, 2, 3].map((i: number) => <OfferSkeleton key={i} />)}
        {!loading && foundOffers.length < 1 && (
          <NotFound
            text={
              <>
                Offers not found. Please, try another chain, token or change the
                amount.
              </>
            }
          />
        )}
        {!loading &&
          foundOffers.length > 0 &&
          foundOffers.map((offer: OfferType) => (
            <OfferPublic
              key={offer._id}
              compact
              offer={offer}
              fromAmount={amount}
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
