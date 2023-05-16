import React, { useState } from 'react';
import { Skeleton, SxProps, Typography } from '@mui/material';
import { Box } from '@mui/system';
import moment from 'moment';
import { Card } from '../Card/Card';
import TransactionID from '../TransactionID/TransactionID';
import OfferPublic from '../OfferPublic/OfferPublic';
import { OrderType, ChainType, OrderStatusType } from '../../types';
import {
  getChainById,
  getOfferProviderLink,
  getOrderBuyerLink,
  getOrderFromChain,
  getOrderFromToken,
  getOrderLink,
  getOrderStatus,
} from '../../utils';
import PageCardSubmitButton from '../PageCardSubmitButton/PageCardSubmitButton';
import Countdown from 'react-countdown';

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
  const [now] = useState(Date.parse(order.date));
  const providerLink =
    order && order?.offer
      ? getOfferProviderLink(order?.offer, chains)
      : undefined;

  const destAddrLink = order ? getOrderBuyerLink(order, chains) : undefined;

  const renderAddress = (value: string, link: string) => {
    return (
      <TransactionID
        value={value}
        label=""
        link={link}
        containerComponent="span"
        containerStyle={{
          display: 'inline-flex',
          gap: '2px',
        }}
        valueStyle={{
          color: '#000',
          fontSize: '14px',
          fontWeight: '500',
        }}
        startLength={6}
        endLength={4}
        buttonStyle={{
          padding: '0 1px',
        }}
      />
    );
  };

  const countdownRenderer = ({
    days,
    hours,
    minutes,
    seconds,
    completed,
  }: {
    days: any;
    hours: any;
    minutes: any;
    seconds: any;
    completed: any;
  }) => {
    if (!order) {
      return null;
    }
    if (completed) {
      // Render a completed state
      return (
        <>
          <Typography gutterBottom variant="body2">
            You should have received a transfer of {order.offer?.amount}{' '}
            {order.offer?.token} on{' '}
            {getChainById(order.offer?.chainId || '', chains)?.label || ''} from{' '}
            {renderAddress(order.offer?.provider || '', providerLink || '')} in
            your wallet{' '}
            {renderAddress(order.destAddr || '', destAddrLink || '')}. Check
            your wallet.
          </Typography>
          <Typography variant="body2">
            If you have not received anything within the next 5 minutes, please{' '}
            <a
              style={{ color: '#3f49e1' }}
              href="https://discord.gg/PCMTWg3KzE"
              target="_blank"
              rel="noreferrer"
            >
              visit our Discord
            </a>
            .
          </Typography>
        </>
      );
    } else {
      // Render a countdown
      return (
        <>
          <Typography variant="body2">
            You should receive {order.offer?.amount} {order.offer?.token} on{' '}
            {getChainById(order.offer?.chainId || '', chains)?.label || ''} from{' '}
            {renderAddress(order.offer?.provider || '', providerLink || '')} in
            your wallet{' '}
            {renderAddress(order.destAddr || '', destAddrLink || '')} within{' '}
            {days > 0 ? `${days} day${days !== 1 ? 's' : ''} ` : ''}{' '}
            {hours > 0 ? `${hours} hour${hours !== 1 ? 's' : ''} ` : ''}
            {minutes > 0
              ? `${minutes} minute${minutes !== 1 ? 's' : ''} and`
              : ''}{' '}
            {seconds} second{seconds !== 1 ? 's' : ''}.
          </Typography>
        </>
      );
    }
  };

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
      {offer && (
        <Box
          sx={{
            paddingLeft: '16px',
            paddingRight: '16px',
            paddingBottom: '16px',
          }}
        >
          <Typography variant="h6" gutterBottom>
            What's next?
          </Typography>
          {order.status === OrderStatusType.PENDING ? (
            <Typography variant="body2">
              Once your transaction will be confirmed, you should receive{' '}
              {order.offer?.amount} {order.offer?.token} on{' '}
              {getChainById(order.offer?.chainId || '', chains)?.label || ''}{' '}
              from{' '}
              {renderAddress(order.offer?.provider || '', providerLink || '')}{' '}
              in your wallet{' '}
              {renderAddress(order.destAddr || '', destAddrLink || '')} within{' '}
              {moment
                .duration(parseFloat(order.offer?.estimatedTime || '0') * 1000)
                .humanize()}
              .
            </Typography>
          ) : order.status === OrderStatusType.COMPLETE ? (
            <>
              <Typography gutterBottom variant="body2">
                You should have received a transfer of {order.offer?.amount}{' '}
                {order.offer?.token} on{' '}
                {getChainById(order.offer?.chainId || '', chains)?.label || ''}{' '}
                from{' '}
                {renderAddress(order.offer?.provider || '', providerLink || '')}{' '}
                in your wallet{' '}
                {renderAddress(order.destAddr || '', destAddrLink || '')}. Check
                your wallet.
              </Typography>
              <Typography variant="body2">
                If you have not received anything within the next 5 minutes,
                please{' '}
                <a
                  style={{ color: '#3f49e1' }}
                  href="https://discord.gg/PCMTWg3KzE"
                  target="_blank"
                  rel="noreferrer"
                >
                  visit our Discord
                </a>
                .
              </Typography>
            </>
          ) : (
            <Countdown
              date={
                now +
                (offer?.estimatedTime
                  ? parseInt(offer.estimatedTime) * 1000
                  : 0)
              }
              renderer={countdownRenderer}
            />
          )}
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
            label={order.isComplete ? 'Completed' : getOrderStatus(order)}
            onClick={() => {}}
          />
        </Box>
      )}
    </Card>
  );
};

export default OrderHistoryCard;
