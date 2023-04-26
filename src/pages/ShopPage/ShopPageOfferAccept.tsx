import React, { useState } from 'react';
import { Box } from '@mui/system';
import Countdown from 'react-countdown';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import {
  AlertBox,
  Loading,
  OrderCard,
  OrderSkeleton,
  TextInput,
  TransactionID,
} from '../../components';
import {
  useAppDispatch,
  useAppSelector,
  selectChainsItems,
  selectShopError,
  selectShopModal,
  setShopModal,
  selectOrdersItems,
  selectShopOrderStatus,
  setShopOfferId,
  setShopOorderTransactionId,
  selectShopOrderTransactionId,
  selectUserAddress,
  selectUserAccessToken,
} from '../../store';
import {
  ErrorMessageType,
  OrderPlacingStatusType,
  OrderType,
} from '../../types';
import {
  getChainById,
  getOfferProviderLink,
  getOrderBuyerLink,
  validateEmail,
} from '../../utils';
import { ICONS } from '../../config';
import { useShopController } from '../../controllers';

type Props = {};

const ShopPageOfferAccept = (props: Props) => {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector(selectUserAccessToken);
  const userWalletAddress = useAppSelector(selectUserAddress);
  const showModal = useAppSelector(selectShopModal);
  const errorMessage = useAppSelector(selectShopError);
  const orderTransactionId = useAppSelector(selectShopOrderTransactionId);
  const chains = useAppSelector(selectChainsItems);
  const orders = useAppSelector(selectOrdersItems);
  const orderStatus = useAppSelector(selectShopOrderStatus);
  const createdOrder =
    orderTransactionId &&
    orders.find((order: OrderType) => order.hash === orderTransactionId);

  const providerLink =
    createdOrder && createdOrder?.offer
      ? getOfferProviderLink(createdOrder?.offer, chains)
      : undefined;

  const destAddrLink = createdOrder
    ? getOrderBuyerLink(createdOrder, chains)
    : undefined;

  const [userEmail, setUserEmail] = useState('');
  const [userEmailSubmitted, setUserEmailSubmitted] = useState(false);
  const [userEmailError, setUserEmailError] = useState<ErrorMessageType>({
    type: '',
    text: '',
  });
  const [userEmailSubmitting, setUserEmailSubmitting] = useState(false);

  const [now] = useState(Date.now());

  const { handleEmailSubmitAction } = useShopController();

  const handleModalClosed = () => {
    dispatch(setShopModal(false));
  };

  const handleModalCloseClick = () => {
    dispatch(setShopOfferId(''));
    dispatch(setShopOorderTransactionId(''));
    dispatch(setShopModal(false));
  };

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
      onClose={handleModalClosed}
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
                  {!userEmailSubmitted ? (
                    <Box>
                      <TextInput
                        label="Notify me on completion"
                        value={userEmail}
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>
                        ) => {
                          setUserEmail(event.target.value);
                        }}
                        placeholder="you@domain.xzy"
                        error={userEmailError}
                        name="email"
                        endAdornment={
                          <Box>
                            <Button
                              disableElevation
                              size="small"
                              variant="contained"
                              onClick={async () => {
                                setUserEmailError({
                                  type: '',
                                  text: '',
                                });
                                if (!userEmail) {
                                  setUserEmailError({
                                    type: 'email',
                                    text: 'Email is required',
                                  });
                                  return;
                                }
                                if (!validateEmail(userEmail)) {
                                  setUserEmailError({
                                    type: 'email',
                                    text: 'Email is not valid',
                                  });
                                  return;
                                }
                                setUserEmailSubmitting(true);
                                const res = await handleEmailSubmitAction(
                                  accessToken,
                                  userEmail,
                                  createdOrder.orderId,
                                  userWalletAddress
                                );
                                if (res) {
                                  setUserEmailSubmitted(true);
                                  setUserEmailSubmitting(false);
                                  setUserEmail('');
                                  setUserEmailError({
                                    type: '',
                                    text: '',
                                  });
                                } else {
                                  setUserEmailSubmitting(false);
                                  setUserEmailError({
                                    type: 'email',
                                    text: 'Server error',
                                  });
                                }
                              }}
                              sx={{
                                fontSize: '14px',
                                padding: '4px 8px 5px',
                                display: 'inline-block',
                                width: 'auto',
                                margin: '0 4px 0 4px',
                                background: '#3f49e1',
                                color: '#fff',
                                borderRadius: '8px',
                                minWidth: 0,
                                whiteSpace: 'nowrap',
                                '&:hover': {
                                  background: 'rgb(50, 58, 180)',
                                  color: '#fff',
                                  opacity: 1,
                                },
                              }}
                            >
                              {userEmailSubmitting ? 'Submitting' : `Enable`}
                            </Button>
                          </Box>
                        }
                      />
                    </Box>
                  ) : (
                    <Box sx={{ marginTop: '16px' }}>
                      <Typography variant="body2">
                        You will get email notification once the order is
                        complete.
                      </Typography>
                    </Box>
                  )}
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
                handleModalCloseClick();
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

export default ShopPageOfferAccept;
