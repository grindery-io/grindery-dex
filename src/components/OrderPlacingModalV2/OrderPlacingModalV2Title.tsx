import React, { useEffect, useState } from 'react';
import { Box } from '@mui/system';
import { Button, Stack, Typography } from '@mui/material';
import { OrderPlacingStatusType, OrderStatusType } from '../../types';
import { getOrderSteps } from '../../utils';
import Countdown from 'react-countdown';
import { OrderPlacingModalV2Props } from './OrderPlacingModalV2';
import { ActionRequired, Error, OrderCompleted, Processing } from '../../icons';

const iconComponents = {
  ORDER_COMPLETED: <OrderCompleted />,
  ACTION_REQUIRED: <ActionRequired />,
  ERROR: <Error />,
  PROCESSING: <Processing />,
};

const OrderPlacingModalV2Title = (props: OrderPlacingModalV2Props) => {
  const {
    errorMessage,
    orderStatus,
    createdOrder,
    chains,
    offer: selectedoffer,
    onClose,
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
  const status = actions[activeAction]?.status || '';

  useEffect(() => {
    if (createdOrder) {
      setNow(Date.parse(createdOrder.date));
    }
  }, [createdOrder]);

  const geticonByStatus = (status: string) => {
    switch (status) {
      case OrderPlacingStatusType.WAITING_NETWORK_SWITCH:
        return 'ACTION_REQUIRED';
      case OrderPlacingStatusType.WAITING_APPROVAL:
        return 'ACTION_REQUIRED';
      case OrderPlacingStatusType.PROCESSING_APPROVAL:
        return 'PROCESSING';
      case OrderPlacingStatusType.WAITING_CONFIRMATION:
        return 'ACTION_REQUIRED';
      case OrderStatusType.PENDING:
        return 'PROCESSING';
      case OrderStatusType.SUCCESS:
        return 'PROCESSING';
      case OrderStatusType.COMPLETE:
        return 'ORDER_COMPLETED';
      default:
        return 'ACTION_REQUIRED';
    }
  };

  const renderTitleWithIcon = (
    title: string,
    iconState: 'ORDER_COMPLETED' | 'ACTION_REQUIRED' | 'ERROR' | 'PROCESSING'
  ) => (
    <Stack
      component="span"
      direction="row"
      alignItems="center"
      justifyContent="flex-start"
      flexWrap="nowrap"
      gap="12px"
    >
      <span className="animated-icon">{iconComponents[iconState]}</span>
      <span>{title}</span>
    </Stack>
  );

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
          {renderTitleWithIcon(
            'You should have received your tokens',
            'ORDER_COMPLETED'
          )}
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
          {renderTitleWithIcon(
            `Wait for your tokens to arrive within ${
              days > 0 ? `${days} day${days !== 1 ? 's' : ''} ` : ''
            } ${hours > 0 ? `${hours} hour${hours !== 1 ? 's' : ''} ` : ''}${
              minutes > 0
                ? `${minutes} minute${minutes !== 1 ? 's' : ''} and`
                : ''
            } ${seconds} second${seconds !== 1 ? 's' : ''}`,
            'PROCESSING'
          )}
        </>
      );
    }
  };

  return (
    <Box
      sx={{
        margin: '64px auto 0',
        maxWidth: '1028px',
        width: '100%',
        padding: '24px',
        boxSizing: 'border-box',
        background: '#0B0C0E',
        color: '#FFFFFF',
        borderRadius: '20px',
        '& .animated-icon svg': {
          width: '32px',
          height: '32px',
          display: 'block',
        },
      }}
    >
      {errorMessage?.type === 'acceptOffer' && errorMessage?.text ? (
        <>
          <Typography variant="h1" sx={{ margin: '0', padding: 0 }}>
            {renderTitleWithIcon('Order Processing Error', 'ERROR')}
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
            {errorMessage.text}
          </Typography>
          <br />
          <Button
            sx={{
              whiteSpace: 'nowrap',
              border: '1px solid #fff',
              marginTop: '16px',
              padding: '12px 24px',
              width: 'auto',
            }}
            size="small"
            onClick={() => {
              onClose();
            }}
          >
            Close and try again
          </Button>
        </>
      ) : (
        <>
          {createdOrder &&
          createdOrder.status === OrderStatusType.COMPLETION_FAILURE ? (
            <>
              <Typography variant="h1" sx={{ margin: '0', padding: 0 }}>
                {renderTitleWithIcon('Order failed', 'ERROR')}
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
                  renderTitleWithIcon(title, geticonByStatus(status))
                )}
              </Typography>
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default OrderPlacingModalV2Title;
