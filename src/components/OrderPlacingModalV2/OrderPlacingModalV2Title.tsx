import React, { useEffect, useState } from 'react';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';
import { EmailNotificationForm } from '..';
import { OrderStatusType } from '../../types';
import { getOrderSteps } from '../../utils';
import Countdown from 'react-countdown';
import { OrderPlacingModalV2Props } from './OrderPlacingModalV2';

const OrderPlacingModalV2Title = (props: OrderPlacingModalV2Props) => {
  const {
    orderStatus,
    createdOrder,
    chains,
    onEmailSubmit,
    offer: selectedoffer,
  } = props;

  const offer = createdOrder?.offer || selectedoffer;

  const [now, setNow] = useState(
    createdOrder ? Date.parse(createdOrder.date) : Date.now()
  );

  const actions = offer ? getOrderSteps(offer, chains, createdOrder) : [];

  const activeActionIndex = actions.findIndex(
    (step) =>
      step &&
      (createdOrder?.status
        ? step.status === createdOrder?.status
        : step.status === orderStatus)
  );

  const activeAction = activeActionIndex > -1 ? activeActionIndex : 0;

  const title = actions[activeAction]?.title || '';

  useEffect(() => {
    if (createdOrder) {
      setNow(Date.parse(createdOrder.date));
    }
  }, [createdOrder]);

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
    if (!createdOrder) {
      return null;
    }
    if (completed) {
      // Render a completed state
      return (
        <>
          You should have received your tokens
          <br />
          <Typography
            variant="body2"
            component="span"
            sx={{
              display: 'inline-block',
              lineHeight: '1.5',
              marginTop: '8px',
            }}
          >
            If you have not received anything within the next 5 minutes, please{' '}
            <a
              style={{ color: '#F57F21', whiteSpace: 'nowrap' }}
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
          Wait for your tokens to arrive within{' '}
          {days > 0 ? `${days} day${days !== 1 ? 's' : ''} ` : ''}{' '}
          {hours > 0 ? `${hours} hour${hours !== 1 ? 's' : ''} ` : ''}
          {minutes > 0
            ? `${minutes} minute${minutes !== 1 ? 's' : ''} and`
            : ''}{' '}
          {seconds} second{seconds !== 1 ? 's' : ''}
        </>
      );
    }
  };

  return (
    <Box>
      {createdOrder &&
      createdOrder.status === OrderStatusType.COMPLETION_FAILURE ? (
        <>
          <Typography variant="h1" sx={{ margin: '0', padding: 0 }}>
            Order failed
          </Typography>
          <Typography
            variant="body2"
            component="span"
            sx={{
              display: 'inline-block',
              lineHeight: '1.5',
              marginTop: '8px',
            }}
          >
            Please{' '}
            <a
              style={{ color: '#F57F21', whiteSpace: 'nowrap' }}
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
        <>
          <Typography variant="h1" sx={{ margin: '0', padding: 0 }}>
            {offer && activeAction === actions.length - 2 ? (
              <Countdown
                date={
                  now +
                  (offer?.estimatedTime
                    ? parseInt(offer.estimatedTime) * 1000
                    : 0)
                }
                renderer={countdownRenderer}
              />
            ) : (
              title
            )}
          </Typography>

          {(!createdOrder ||
            createdOrder.status !== OrderStatusType.COMPLETE) && (
            <Box sx={{ maxWidth: '332px', marginTop: '16px' }}>
              <EmailNotificationForm onSubmit={onEmailSubmit} />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default OrderPlacingModalV2Title;
