import React from 'react';
import { Skeleton, SxProps, Typography } from '@mui/material';
import { Box } from '@mui/system';
import moment from 'moment';
import { Card } from '../Card/Card';
import TransactionID from '../TransactionID/TransactionID';
import OfferPublic from '../Offer/OfferPublic';
import { OrderType, ChainType } from '../../types';
import {
  getOrderFromChain,
  getOrderFromToken,
  getOrderLink,
} from '../../utils';
import PageCardSubmitButton from '../PageCardSubmitButton/PageCardSubmitButton';

type Props = {
  order: OrderType;
  chains: ChainType[];
  id?: string;
  excludeSteps?: ('gas' | 'rate' | 'time' | 'impact')[];
  hideStatus?: boolean;
  containerStyle?: SxProps | React.CSSProperties;
  advancedMode?: boolean;
};

const OrderHistoryCard = (props: Props) => {
  const {
    order,
    chains,
    id,
    excludeSteps,
    hideStatus,
    containerStyle,
    advancedMode,
  } = props;
  const offer = order.offer;
  const explorerLink = getOrderLink(order, chains);
  const fromChain = getOrderFromChain(order, chains);
  const fromToken = getOrderFromToken(order, chains);

  return (
    <Card
      className={`OrderCard ${
        order.isComplete ? 'OrderCard-complete' : 'OrderCard-incomplete'
      }`}
      id={id}
      flex={1}
      sx={{
        borderRadius: '12px',
        marginBottom: '12px',
        backgroundColor: '#fff',
        ...(containerStyle || {}),
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

      {offer ? (
        <OfferPublic
          advancedMode={advancedMode}
          key={offer._id}
          chains={chains}
          offer={offer}
          fromAmount={order.amountTokenDeposit}
          containerStyle={{
            border: 'none',
            marginTop: '8px',
            marginBottom: '0',
          }}
          userType="a"
          fromChain={fromChain}
          fromToken={fromToken || ''}
          label="You receive"
          fromLabel="You pay"
          excludeSteps={
            excludeSteps && excludeSteps.length
              ? excludeSteps
              : order.isComplete
              ? ['gas', 'impact', 'time']
              : ['gas', 'impact']
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
      {!hideStatus && (
        <Box
          sx={{
            padding: '8px 16px 6px',
            '& button': {
              margin: 0,
              fontSize: '13px',
              padding: '8px 20px',
              color: '#fff',
              backgroundColor: order.isComplete
                ? '#00B674 !important'
                : '#FFB930 !important',
              '&:hover': {
                color: '#fff',
                backgroundColor: order.isComplete
                  ? '#00B674 !important'
                  : '#FFB930 !important',
                cursor: 'default',
              },
            },
            '& > div': {
              marginTop: 0,
            },
          }}
        >
          <PageCardSubmitButton
            disableRipple
            className="OrderCard__button"
            label={order.isComplete ? 'Completed' : 'Processing'}
            onClick={() => {}}
          />
        </Box>
      )}
    </Card>
  );
};

export default OrderHistoryCard;
