import React from 'react';
import { Box } from '@mui/system';
import DexCard from '../../components/DexCard/DexCard';
import DexCardHeader from '../../components/DexCard/DexCardHeader';
import DexCardBody from '../../components/DexCard/DexCardBody';
import NotFound from '../../components/NotFound/NotFound';
import OfferPublic from '../../components/Offer/OfferPublic';
import OfferSkeleton from '../../components/Offer/OfferSkeleton';
import { useNavigate } from 'react-router-dom';
import { OfferType } from '../../types/OfferType';
import { ROUTES } from '../../config/routes';
import { useAppSelector } from '../../store/storeHooks';
import {
  selectTradeFilter,
  selectTradeLoading,
  selectTradeOffers,
} from '../../store/slices/tradeSlice';

type Props = {};

const TradePageOffersList = (props: Props) => {
  let navigate = useNavigate();
  const loading = useAppSelector(selectTradeLoading);
  const foundOffers = useAppSelector(selectTradeOffers);
  const { amount } = useAppSelector(selectTradeFilter);

  return (
    <DexCard>
      <DexCardHeader title="Offers" />
      <DexCardBody maxHeight="540px">
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
      </DexCardBody>
    </DexCard>
  );
};

export default TradePageOffersList;
