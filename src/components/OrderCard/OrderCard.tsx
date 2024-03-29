import React from 'react';
import { Skeleton, SxProps, Typography } from '@mui/material';
import { Box } from '@mui/system';
import moment from 'moment';
import { Card } from '../Card/Card';
import AlertBox from '../AlertBox/AlertBox';
import TransactionID from '../TransactionID/TransactionID';
import OfferPublic from '../OfferPublic/OfferPublic';
import { OrderType, ChainType, OrderStatusType } from '../../types';
import {
  getOrderButtonLabel,
  getOrderBuyerLink,
  getOrderFromChain,
  getOrderFromToken,
  getOrderLink,
} from '../../utils';
import PageCardSubmitButton from '../PageCardSubmitButton/PageCardSubmitButton';

type Props = {
  order: OrderType;
  userType: 'a' | 'b';
  onCompleteClick?: (order: OrderType) => void;
  error?: string;
  chains: ChainType[];
  id?: string;
  excludeSteps?: ('gas' | 'rate' | 'time' | 'impact')[];
  hideStatus?: boolean;
  containerStyle?: SxProps | React.CSSProperties;
  completing?: string;
};

const OrderCard = (props: Props) => {
  const {
    order,
    userType,
    onCompleteClick,
    error,
    chains,
    id,
    excludeSteps,
    hideStatus,
    containerStyle,
    completing,
  } = props;
  const offer = order.offer;
  const loading = Boolean(completing && completing === order.orderId);
  const isUserA = userType === 'a';
  const explorerLink = getOrderLink(order, chains);
  const fromChain = getOrderFromChain(order, chains);
  const fromToken = getOrderFromToken(order, chains);
  const buyer = !isUserA && order && order.destAddr;
  const buyerLink = !isUserA ? getOrderBuyerLink(order, chains) : '';

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
          advancedMode={false}
          key={offer._id}
          chains={chains}
          offer={offer}
          fromAmount={order.amountTokenDeposit}
          containerStyle={{
            border: 'none',
            marginTop: '8px',
            marginBottom: '0',
          }}
          userType={userType}
          fromChain={fromChain}
          fromToken={fromToken || ''}
          label={isUserA ? 'You receive' : 'You sell'}
          fromLabel={isUserA ? 'You pay' : 'You receive'}
          excludeSteps={
            excludeSteps && excludeSteps.length
              ? excludeSteps
              : isUserA
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
                : loading || isUserA || order.status !== OrderStatusType.SUCCESS
                ? '#FFB930 !important'
                : '#FF5858 !important',
              '&:hover': {
                color: '#fff',
                backgroundColor: order.isComplete
                  ? '#00B674 !important'
                  : loading ||
                    isUserA ||
                    order.status !== OrderStatusType.SUCCESS
                  ? '#FFB930 !important'
                  : '#FF5858 !important',
                cursor: isUserA
                  ? 'default'
                  : loading || order.status !== OrderStatusType.SUCCESS
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
          <PageCardSubmitButton
            disableRipple={
              isUserA ||
              order.status !== OrderStatusType.SUCCESS ||
              order.isComplete
            }
            className="OrderCard__button"
            label={getOrderButtonLabel(order, loading, isUserA)}
            onClick={() => {
              if (!isUserA && onCompleteClick) {
                onCompleteClick(order);
              }
            }}
            loading={loading}
          />
        </Box>
      )}
    </Card>
  );
};

export default OrderCard;
