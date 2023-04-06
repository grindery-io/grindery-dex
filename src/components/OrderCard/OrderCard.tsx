import React, { useEffect, useState } from 'react';
import { Skeleton, Typography } from '@mui/material';
import { Box } from '@mui/system';
import useOffers from '../../hooks/useOffers';
import useGrinderyChains from '../../hooks/useGrinderyChains';
import moment from 'moment';
import DexCardSubmitButton from '../DexCard/DexCardSubmitButton';
import { Card } from '../Card/Card';
import AlertBox from '../AlertBox/AlertBox';
import TransactionID from '../TransactionID/TransactionID';
import OfferPublic from '../Offer/OfferPublic';
import Offer from '../../models/Offer';
import Order from '../../models/Order';
import { useAppSelector } from '../../store/storeHooks';
import { selectChainsItems } from '../../store/slices/chainsSlice';

type Props = {
  order: Order;
  userType: 'a' | 'b';
  onCompleteClick?: (order: Order) => Promise<boolean>;
  error?: string;
};

const OrderCard = (props: Props) => {
  const { order, userType, onCompleteClick, error } = props;
  const { getOfferById } = useOffers();
  const [offer, setOffer] = useState<Offer | false>(false);
  const chains = useAppSelector(selectChainsItems);
  const [loading, setLoading] = useState(false);
  const isUserA = userType === 'a';

  const explorerLink = order.getOrderLink(chains);

  const fromChain = order.getFromChain(chains);
  const fromToken = order.getFromToken(chains);

  const buyer = !isUserA && order && order.destAddr;
  const buyerLink = !isUserA ? order.getBuyerLink(chains) : '';

  const getOffer = async (offerId: string) => {
    const offerRes = await getOfferById(offerId);
    setOffer(offerRes);
  };

  const handleCompleteClick = async () => {
    if (order.orderId && onCompleteClick) {
      setLoading(true);
      const res = await onCompleteClick(order);
      if (res) {
        // handle success
      } else {
        // handle fail
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    if (order.offerId) {
      getOffer(order.offerId);
    }
    // eslint-disable-next-line
  }, [order.offerId]);

  return (
    <Card
      flex={1}
      style={{
        borderRadius: '12px',
        marginBottom: '12px',
        backgroundColor: '#fff',
      }}
    >
      {order.date && (
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            color: 'rgba(0, 0, 0, 0.6)',
            margin: '16px 16px 4px',
          }}
        >
          {moment(order.date).format('MMMM Do YYYY, h:mm:ss a')}
        </Typography>
      )}
      {order.hash && (
        <TransactionID
          containerStyle={{ padding: '0 16px 0' }}
          value={order.hash || ''}
          label="Order ID"
          link={explorerLink}
        />
      )}
      {buyer && (
        <TransactionID
          containerStyle={{ padding: '0 16px 0' }}
          value={buyer || ''}
          label="Buyer"
          link={buyerLink || undefined}
        />
      )}

      {offer ? (
        <OfferPublic
          key={offer._id}
          offer={offer}
          fromAmount={order.amountTokenDeposit}
          containerStyle={{
            border: 'none',
            marginTop: '8px',
            marginBottom: '0',
          }}
          userType={userType}
          fromChain={fromChain}
          fromToken={fromToken}
          label={isUserA ? 'You receive' : 'You sell'}
          fromLabel={isUserA ? 'You pay' : 'You receive'}
          excludeSteps={
            isUserA
              ? order.isComplete
                ? ['gas', 'impact', 'time']
                : ['gas', 'impact']
              : ['gas', 'impact', 'time']
          }
          calculateAmount
        />
      ) : (
        <>
          <Box sx={{ margin: '16px 16px 0' }}>
            <Skeleton width="150px" height="60px" />
          </Box>
          <Box sx={{ margin: '16px 16px 0' }}>
            <Skeleton width="150px" height="30px" />
          </Box>
          <Box sx={{ margin: '16px 16px 0' }}>
            <Skeleton width="150px" height="30px" />
          </Box>
          <Box sx={{ margin: '16px 16px 32px' }}>
            <Skeleton width="150px" height="30px" />
          </Box>
        </>
      )}
      {error && (
        <Box sx={{ margin: '0 16px' }}>
          <AlertBox color="error" wrapperStyle={{ margin: '10px 0' }}>
            <p style={{ fontSize: '14px' }}>{error}</p>
          </AlertBox>
        </Box>
      )}

      <Box
        sx={{
          padding: '0 16px 6px',
          '& button': {
            margin: 0,
            fontSize: '13px',
            padding: '8px 20px',
            color: '#fff',
            backgroundColor: order.isComplete
              ? '#00B674'
              : loading || isUserA
              ? '#FFB930'
              : '#FF5858',
            '&:hover': {
              color: '#fff',
              backgroundColor: order.isComplete
                ? '#00B674'
                : loading || isUserA
                ? '#FFB930'
                : '#FF5858',
              cursor: isUserA
                ? 'default'
                : loading
                ? 'not-allowed'
                : order.isComplete
                ? 'default'
                : 'pointer',
            },
          },
          '& > div': {
            marginTop: 0,
          },
        }}
      >
        <DexCardSubmitButton
          label={
            order.isComplete
              ? 'Completed'
              : loading
              ? 'Processing'
              : isUserA
              ? 'Processing'
              : `Send ${parseFloat(order.amountTokenOffer)
                  .toFixed(6)
                  .toLocaleString()} ${offer ? offer.token : ''}`
          }
          onClick={() => {
            if (!isUserA) {
              if (!order.isComplete && !loading) {
                handleCompleteClick();
              }
            }
          }}
        />
      </Box>
    </Card>
  );
};

export default OrderCard;
