import React, { useEffect, useState } from 'react';
import { Box } from '@mui/system';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import Countdown from 'react-countdown';
import {
  AlertBox,
  Loading,
  OrderCard,
  TransactionID,
  OrderSkeleton,
  EmailNotificationForm,
} from '../../components';
import {
  ChainType,
  ErrorMessageType,
  OrderPlacingStatusType,
  OrderType,
} from '../../types';
import { ICONS } from '../../config';
import {
  getChainById,
  getOfferProviderLink,
  getOrderBuyerLink,
} from '../../utils';

type Props = {
  open: boolean;
  orderStatus: OrderPlacingStatusType;
  createdOrder?: OrderType;
  chains: ChainType[];
  errorMessage: ErrorMessageType;
  onEmailSubmit: (email: string) => Promise<boolean>;
  onClose: () => void;
};

const OrderPlacingModal = (props: Props) => {
  const {
    open,
    orderStatus,
    createdOrder,
    chains,
    errorMessage,
    onEmailSubmit,
    onClose,
  } = props;
  const showModal = open;

  const providerLink =
    createdOrder && createdOrder?.offer
      ? getOfferProviderLink(createdOrder?.offer, chains)
      : undefined;

  const destAddrLink = createdOrder
    ? getOrderBuyerLink(createdOrder, chains)
    : undefined;

  const [now, setNow] = useState(Date.now());

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
    if (!createdOrder) {
      return null;
    }
    if (completed) {
      // Render a completed state
      return (
        <>
          <Typography gutterBottom variant="body2">
            You should have received a transfer of {createdOrder.offer?.amount}{' '}
            {createdOrder.offer?.token} on{' '}
            {getChainById(createdOrder.offer?.chainId || '', chains)?.label ||
              ''}{' '}
            from{' '}
            {renderAddress(
              createdOrder.offer?.provider || '',
              providerLink || ''
            )}{' '}
            in your wallet{' '}
            {renderAddress(createdOrder.destAddr || '', destAddrLink || '')}.
            Check your wallet.
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
            You should receive {createdOrder.offer?.amount}{' '}
            {createdOrder.offer?.token} on{' '}
            {getChainById(createdOrder.offer?.chainId || '', chains)?.label ||
              ''}{' '}
            from{' '}
            {renderAddress(
              createdOrder.offer?.provider || '',
              providerLink || ''
            )}{' '}
            in your wallet{' '}
            {renderAddress(createdOrder.destAddr || '', destAddrLink || '')}{' '}
            within {days > 0 ? `${days} day${days !== 1 ? 's' : ''} ` : ''}{' '}
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

  useEffect(() => {
    if (orderStatus === OrderPlacingStatusType.COMPLETED) {
      const nowDate = Date.now();
      setNow(nowDate);
    }
  }, [orderStatus]);

  return (
    <Dialog
      fullWidth
      sx={{
        width: '100%',
        maxWidth: '450px',
        margin: '0 auto',
        '& .MuiDialog-paper': {
          background: '#fff',
        },
        '& .MuiDialogContent-root': {
          paddingLeft: '8px',
          paddingRight: '8px',
        },
      }}
      open={showModal}
    >
      <DialogTitle sx={{ textAlign: 'center', paddingBottom: '0px' }}>
        {orderStatus}
      </DialogTitle>
      <DialogContent sx={{ paddingBottom: '0' }}>
        {orderStatus === OrderPlacingStatusType.PROCESSING && (
          <Box sx={{ padding: '16px 0' }}>
            <Loading />
          </Box>
        )}
        {(orderStatus === OrderPlacingStatusType.WAITING_NETWORK_SWITCH ||
          orderStatus === OrderPlacingStatusType.WAITING_CONFIRMATION) && (
          <Box sx={{ padding: '16px 0', textAlign: 'center' }}>
            <img
              style={{ width: '100%', height: 'auto', maxWidth: '64px' }}
              src={ICONS.METAMASK}
              alt=""
            />
          </Box>
        )}

        {orderStatus === OrderPlacingStatusType.ERROR &&
          errorMessage &&
          errorMessage.type === 'acceptOffer' &&
          errorMessage.text && (
            <Box sx={{ paddingLeft: '16px', paddingRight: '16px' }}>
              <AlertBox color="error" wrapperStyle={{ marginTop: '0' }}>
                <p>{errorMessage.text}</p>
              </AlertBox>
            </Box>
          )}

        {orderStatus === OrderPlacingStatusType.COMPLETED && (
          <>
            {createdOrder ? (
              <>
                <OrderCard
                  order={createdOrder}
                  userType="a"
                  chains={chains}
                  excludeSteps={['gas', 'rate', 'time', 'impact']}
                  hideStatus
                  containerStyle={{
                    border: 'none',
                  }}
                />
                <Box sx={{ paddingLeft: '16px', paddingRight: '16px' }}>
                  <Typography variant="h6" gutterBottom>
                    What's next?
                  </Typography>
                  <Countdown
                    date={
                      now +
                      (createdOrder.offer?.estimatedTime
                        ? parseInt(createdOrder.offer.estimatedTime) * 1000
                        : 0)
                    }
                    renderer={countdownRenderer}
                  />
                  <EmailNotificationForm onSubmit={onEmailSubmit} />
                </Box>
              </>
            ) : (
              <OrderSkeleton />
            )}
          </>
        )}
        {(orderStatus === OrderPlacingStatusType.COMPLETED ||
          orderStatus === OrderPlacingStatusType.ERROR) && (
          <Box
            sx={{
              margin: '16px 0',
              paddingLeft: '16px',
              paddingRight: '16px',
              flex: 1,
              '& .MuiButton-root': {
                color: 'black',
                borderColor: 'black',
                padding: '6px 12px',
                fontSize: '14px',
                width: '100%',
                '&:hover': {
                  borderColor: 'black',
                  backgroundColor: 'rgba(0,0,0,0.04)',
                },
                '& .MuiTouchRipple-root': {
                  marginRight: '0',
                },
              },
            }}
          >
            <Button
              fullWidth
              size="small"
              variant="outlined"
              onClick={() => {
                onClose();
              }}
            >
              Close
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OrderPlacingModal;
