import React, { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Box } from '@mui/system';
import { Button, IconButton, Typography } from '@mui/material';
import Countdown from 'react-countdown';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import {
  AlertBox,
  OfferPublic,
  Loading,
  PageCard,
  PageCardHeader,
  PageCardBody,
  PageCardSubmitButton,
  OrderCard,
  TransactionID,
  OrderSkeleton,
  TextInput,
} from '../../components';
import {
  useAppDispatch,
  useAppSelector,
  selectChainsItems,
  selectUserAccessToken,
  selectUserAddress,
  selectUserChainId,
  selectUserId,
  selectTradeError,
  selectTradeFilter,
  selectTradeLoading,
  selectTradeOffers,
  selectPoolAbi,
  selectUserAdvancedMode,
  selectOrdersItems,
  setTradeOrderTransactionId,
  selectTradeOrderTransactionId,
  selectTradeOrderStatus,
  setTradeOrderStatus,
} from '../../store';
import {
  ErrorMessageType,
  OfferType,
  OrderPlacingStatusType,
  OrderType,
  TokenType,
} from '../../types';
import { ICONS, ROUTES } from '../../config';
import { useUserController, useTradeController } from '../../controllers';
import {
  getChainById,
  getOfferProviderLink,
  getOrderBuyerLink,
  getTokenById,
  getTokenBySymbol,
  validateEmail,
} from '../../utils';

type Props = {};

const TradePageOfferAccept = (props: Props) => {
  let navigate = useNavigate();
  let { offerId } = useParams();
  const dispatch = useAppDispatch();
  const advancedMode = useAppSelector(selectUserAdvancedMode);
  const user = useAppSelector(selectUserId);
  const userWalletAddress = useAppSelector(selectUserAddress);
  const accessToken = useAppSelector(selectUserAccessToken);
  const userChainId = useAppSelector(selectUserChainId);
  const userAddress = useAppSelector(selectUserAddress);
  const { connectUser: connect } = useUserController();
  const loading = useAppSelector(selectTradeLoading);
  const orderStatus = useAppSelector(selectTradeOrderStatus);
  const foundOffers = useAppSelector(selectTradeOffers);
  const poolAbi = useAppSelector(selectPoolAbi);
  const orderTransactionId = useAppSelector(selectTradeOrderTransactionId);
  const errorMessage = useAppSelector(selectTradeError);
  const chains = useAppSelector(selectChainsItems);
  const filter = useAppSelector(selectTradeFilter);
  const { amount } = filter;
  const fromChain = getChainById('5', chains);
  const fromToken = fromChain?.tokens?.find(
    (token: TokenType) => token.symbol === fromChain?.nativeToken
  );
  const { handleAcceptOfferAction, handleEmailSubmitAction } =
    useTradeController();
  const offer = foundOffers.find((o: OfferType) => o.offerId === offerId);
  const offerChain = getChainById(offer?.chainId || '', chains);
  const exchangeToken = getTokenBySymbol(
    offer?.exchangeToken || '',
    offer?.exchangeChainId || '',
    chains
  );
  const offerToken = getTokenById(
    offer?.tokenId || '',
    offer?.chainId || '',
    chains
  );
  const orders = useAppSelector(selectOrdersItems);
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

  return offer ? (
    <PageCard>
      <PageCardHeader
        title={!orderStatus ? 'Review offer' : orderStatus}
        titleSize={18}
        titleAlign="center"
        startAdornment={
          !orderStatus ? (
            <IconButton
              id="return"
              size="medium"
              edge="start"
              onClick={() => {
                dispatch(setTradeOrderTransactionId(''));
                dispatch(
                  setTradeOrderStatus(OrderPlacingStatusType.UNINITIALIZED)
                );
                navigate(ROUTES.BUY.TRADE.ROOT.FULL_PATH);
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          ) : undefined
        }
        endAdornment={!orderStatus ? <Box width={28} height={40} /> : undefined}
      />
      <PageCardBody maxHeight="540px">
        {!orderStatus && (
          <>
            <Box mt="0px">
              {offerChain && offerToken && (
                <OfferPublic
                  advancedMode={advancedMode}
                  key={offer._id}
                  chains={chains}
                  offer={offer}
                  fromAmount={amount}
                  fromChain={fromChain}
                  fromToken={fromToken || ''}
                  label="You receive"
                  fromLabel="You pay"
                  userType="a"
                />
              )}
            </Box>
            {exchangeToken && (
              <PageCardSubmitButton
                label={
                  user
                    ? loading
                      ? 'Waiting transaction'
                      : typeof fromToken !== 'string' &&
                        fromToken?.address === '0x0'
                      ? 'Place Order'
                      : 'Approve tokens'
                    : 'Connect wallet'
                }
                onClick={
                  user
                    ? () => {
                        handleAcceptOfferAction(
                          offer,
                          accessToken,
                          userChainId,
                          exchangeToken,
                          poolAbi,
                          userAddress,
                          amount,
                          chains
                        );
                      }
                    : () => {
                        connect();
                      }
                }
                disabled={Boolean(user) && loading}
              />
            )}
          </>
        )}
        {(orderStatus === OrderPlacingStatusType.WAITING_NETWORK_SWITCH ||
          orderStatus === OrderPlacingStatusType.WAITING_CONFIRMATION) && (
          <Box sx={{ padding: '0px 0 20px', textAlign: 'center' }}>
            <img
              style={{ width: '100%', height: 'auto', maxWidth: '64px' }}
              src={ICONS.METAMASK}
              alt=""
            />
          </Box>
        )}
        {orderStatus === OrderPlacingStatusType.PROCESSING && (
          <Box sx={{ padding: '0px 0 20px', textAlign: 'center' }}>
            <Loading />
          </Box>
        )}
        {orderStatus === OrderPlacingStatusType.ERROR &&
          errorMessage &&
          errorMessage.type === 'acceptOffer' &&
          errorMessage.text && (
            <>
              <Box
                sx={{
                  paddingTop: '0',
                  paddingBottom: '0px',
                  '& > .MuiBox-root': {
                    marginTop: '0',
                  },
                }}
              >
                <AlertBox color="error">
                  <p>{errorMessage.text}</p>
                </AlertBox>
              </Box>
              <PageCardSubmitButton
                label="Close"
                onClick={() => {
                  dispatch(setTradeOrderTransactionId(''));
                  dispatch(
                    setTradeOrderStatus(OrderPlacingStatusType.UNINITIALIZED)
                  );
                  navigate(ROUTES.BUY.TRADE.ROOT.FULL_PATH);
                }}
              />
            </>
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
                                background: '#3f49e1 !important',
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
            <PageCardSubmitButton
              label="Close"
              onClick={() => {
                dispatch(setTradeOrderTransactionId(''));
                dispatch(
                  setTradeOrderStatus(OrderPlacingStatusType.UNINITIALIZED)
                );
                navigate(ROUTES.BUY.TRADE.ROOT.FULL_PATH);
              }}
            />
          </>
        )}
      </PageCardBody>
    </PageCard>
  ) : (
    <Navigate to={ROUTES.BUY.FULL_PATH} />
  );
};

export default TradePageOfferAccept;
