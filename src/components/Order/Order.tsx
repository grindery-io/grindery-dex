import React, { useEffect, useState } from 'react';
import { OrderType } from '../../types/Order';
import { Skeleton, Typography } from '@mui/material';
import { Box } from '@mui/system';
import useOffers from '../../hooks/useOffers';
import { Offer } from '../../types/Offer';
import useGrinderyChains from '../../hooks/useGrinderyChains';
import { Chain } from '../../types/Chain';
import { TokenType } from '../../types/TokenType';
import moment from 'moment';
import DexCardSubmitButton from '../DexCard/DexCardSubmitButton';
import { Card } from '../Card/Card';
import AlertBox from '../AlertBox/AlertBox';
import TransactionID from '../TransactionID/TransactionID';
import OfferPublic from '../Offer/OfferPublic';

type Props = {
  order: OrderType;
  userType: 'a' | 'b';
  onCompleteClick?: (order: OrderType) => Promise<boolean>;
  error?: string;
};

const Order = (props: Props) => {
  const { order, userType, onCompleteClick, error } = props;
  const { getOfferById } = useOffers();
  const [offer, setOffer] = useState<Offer | false>(false);
  const { chains } = useGrinderyChains();
  const [loading, setLoading] = useState(false);
  const isUserA = userType === 'a';

  const explorerLink = order.hash
    ? (
        chains.find((c: Chain) => c.value === `eip155:5`)
          ?.transactionExplorerUrl || ''
      ).replace('{hash}', order.hash || '')
    : '';

  /*const fromChain = chains.find(
    (c: Chain) => c.chainId === order.chainIdTokenDeposit
  );*/

  /*const fromToken = fromChain?.tokens?.find(
    (t: TokenType) => t.address === order.addressTokenDeposit
  );*/

  const offerChain = chains.find(
    (c: Chain) => offer && c.chainId === offer.chainId
  );
  const offerToken = chains
    .find((c: Chain) => offer && c.chainId === offer.chainId)
    ?.tokens?.find(
      (t: TokenType) => offer && t.coinmarketcapId === offer.tokenId
    );

  const getOffer = async () => {
    if (order.offerId) {
      const offerRes = await getOfferById(order.offerId);
      setOffer(offerRes);
    }
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
    getOffer();
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
      {order.hash && (
        <TransactionID
          containerStyle={{ padding: '16px 16px 0' }}
          value={order.hash || ''}
          label="Order ID"
          link={explorerLink}
        />
      )}
      {order.date && (
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            color: 'rgba(0, 0, 0, 0.6)',
            margin: '2px 16px 0',
          }}
        >
          {moment(order.date).format('MMMM Do YYYY, h:mm:ss a')}
        </Typography>
      )}
      {offer && offerChain && offerToken ? (
        <OfferPublic
          key={offer._id}
          offer={offer}
          chain={offerChain}
          token={offerToken}
          fromAmount={order.amountTokenDeposit}
          containerStyle={{
            border: 'none',
            marginTop: '8px',
            marginBottom: '0',
          }}
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
          padding: '0 16px',
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

export default Order;
