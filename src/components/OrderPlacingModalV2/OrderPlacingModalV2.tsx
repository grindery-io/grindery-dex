import React, { useEffect, useState } from 'react';
import { Box } from '@mui/system';
import {
  Avatar,
  Badge,
  Button,
  Dialog,
  IconButton,
  Skeleton,
  Stack,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import {
  TransactionID,
  EmailNotificationForm,
  CardTitle,
  ChainTokenBox,
  AvatarDefault,
} from '..';
import {
  ChainType,
  ErrorMessageType,
  OfferType,
  OrderPlacingStatusType,
  OrderStatusType,
  OrderType,
} from '../../types';
import {
  getChainById,
  getOfferAmount,
  getOfferExchangeAmount,
  getOfferProviderLink,
  getOrderBuyerLink,
  getOrderLink,
  getOrderSteps,
  getTokenBySymbol,
} from '../../utils';
import { selectUserStore, useAppSelector } from '../../store';
import Countdown from 'react-countdown';
import CloseIcon from '@mui/icons-material/Close';

type Props = {
  open: boolean;
  orderStatus: OrderPlacingStatusType;
  createdOrder?: OrderType;
  chains: ChainType[];
  errorMessage: ErrorMessageType;
  onEmailSubmit?: (email: string) => Promise<boolean>;
  onClose: () => void;
  offer?: OfferType;
  userAmount?: string;
  offerAmount?: string;
};

const OrderPlacingModalV2 = (props: Props) => {
  const {
    open,
    orderStatus,
    createdOrder,
    chains,
    errorMessage,
    onEmailSubmit,
    onClose,
    offer: selectedoffer,
    userAmount,
    offerAmount: customOfferAmount,
  } = props;
  const showModal = open;

  const offer = createdOrder?.offer || selectedoffer;

  const { advancedMode, advancedModeAlert } = useAppSelector(selectUserStore);

  const orderLink = createdOrder ? getOrderLink(createdOrder, chains) : '';

  console.log('orderLink', orderLink);

  const providerLink =
    createdOrder && createdOrder?.offer
      ? getOfferProviderLink(createdOrder?.offer, chains)
      : undefined;

  const destAddrLink = createdOrder
    ? getOrderBuyerLink(createdOrder, chains)
    : undefined;

  const [now, setNow] = useState(
    createdOrder ? Date.parse(createdOrder.date) : Date.now()
  );

  const topShift = advancedMode && advancedModeAlert ? '125px' : '78px';

  const exchangeChain = getChainById(offer?.exchangeChainId || '', chains);
  const exchangeToken = getTokenBySymbol(
    offer?.exchangeToken || '',
    offer?.exchangeChainId || '',
    chains
  );
  const offerChain = getChainById(offer?.chainId || '', chains);
  const offerToken = getTokenBySymbol(
    offer?.token || '',
    offer?.chainId || '',
    chains
  );
  const amount = !userAmount
    ? offer
      ? getOfferAmount(offer)
      : '0'
    : userAmount;
  const offerAmount = !customOfferAmount
    ? offer
      ? getOfferExchangeAmount(offer)
      : '0'
    : customOfferAmount;

  const steps = offer ? getOrderSteps(offer, chains, createdOrder) : [];

  const activeStep =
    steps.findIndex(
      (step) =>
        step &&
        (createdOrder?.status
          ? step.status === createdOrder?.status
          : step.status === orderStatus)
    ) || 0;

  const title = steps[activeStep]?.title || '';
  const text = steps[activeStep]?.content || '';

  useEffect(() => {
    if (createdOrder) {
      setNow(Date.parse(createdOrder.date));
    }
  }, [createdOrder]);

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
              style={{ color: '#F57F21' }}
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
            Your transaction has been confirmed. You should receive{' '}
            {createdOrder.offer?.amount} {createdOrder.offer?.token} on{' '}
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
        width: '100vw',
        maxWidth: '100vw',
        margin: '0 auto',
        height: `calc(100% - ${topShift})`,
        top: topShift,
        '& .MuiBackdrop-root': {
          height: `calc(100% - ${topShift})`,
          top: topShift,
        },
        '& .MuiDialog-paper': {
          background: '#F1F2F4',
          width: '100vw',
          maxWidth: '100vw',
          margin: 0,
          borderRadius: 0,
          flex: 1,
          height: '100%',
          maxHeight: '100%',
          overflow: 'auto',
          boxShadow: 'none',
          padding: '0 20px',
        },
        '& .MuiDialogContent-root': {
          paddingLeft: '8px',
          paddingRight: '8px',
        },
      }}
      open={showModal}
    >
      <Box sx={{ position: 'absolute', top: '16px', right: '16px' }}>
        <IconButton sx={{ color: '#000' }} onClick={onClose}>
          <CloseIcon sx={{ fontSize: 36 }} />
        </IconButton>
      </Box>
      {errorMessage?.text ? (
        <Box sx={{ width: '100%', maxWidth: '455px', margin: '64px auto' }}>
          <Typography variant="h1" sx={{ margin: '0 0 16px' }}>
            Order Processing Error
          </Typography>
          <Typography sx={{ margin: '0 0 16px' }}>
            {errorMessage.text}
          </Typography>
          <Box
            sx={{
              margin: '16px 0',
              '& .MuiButton-root': {
                color: 'white',
                borderColor: 'black',
                padding: '6px 12px',
                fontSize: '14px',
                background: 'black',
                '&:hover': {
                  borderColor: 'black',
                  background: 'black',
                  color: 'white',
                },
                '& .MuiTouchRipple-root': {
                  marginRight: '0',
                },
              },
            }}
          >
            <Button
              size="small"
              onClick={() => {
                onClose();
              }}
            >
              Close and try again
            </Button>
          </Box>
        </Box>
      ) : (
        <Stack
          alignItems="center"
          justifyContent="center"
          gap="105px"
          flexWrap="wrap"
          direction="row"
          sx={{ width: '100%', maxWidth: '1027px', margin: '64px auto' }}
        >
          <Stack
            alignItems="stretch"
            justifyContent="flex-start"
            gap="26px"
            flexWrap="nowrap"
            direction="column"
            sx={{ flex: 1 }}
          >
            <Box>
              <Box
                sx={{
                  maxWidth: '425px',
                  '& .MuiIconButton-root svg': {
                    color: '#F57F21',
                  },
                }}
              >
                <Typography
                  variant="h1"
                  sx={{ margin: '0 0 16px', padding: 0 }}
                >
                  {title}
                </Typography>
                {createdOrder &&
                (createdOrder.status === OrderStatusType.SUCCESS ||
                  createdOrder.status === OrderStatusType.COMPLETION ||
                  createdOrder.status === OrderStatusType.COMPLETE) ? (
                  <>
                    {createdOrder.status === OrderStatusType.COMPLETE ? (
                      <>
                        <Typography gutterBottom variant="body2">
                          You should have received a transfer of{' '}
                          {createdOrder.offer?.amount}{' '}
                          {createdOrder.offer?.token} on{' '}
                          {getChainById(
                            createdOrder.offer?.chainId || '',
                            chains
                          )?.label || ''}{' '}
                          from{' '}
                          {renderAddress(
                            createdOrder.offer?.provider || '',
                            providerLink || ''
                          )}{' '}
                          in your wallet{' '}
                          {renderAddress(
                            createdOrder.destAddr || '',
                            destAddrLink || ''
                          )}
                          . Check your wallet.
                        </Typography>
                        <Typography variant="body2">
                          If you have not received anything within the next 5
                          minutes, please{' '}
                          <a
                            style={{ color: '#F57F21' }}
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
                          (createdOrder.offer?.estimatedTime
                            ? parseInt(createdOrder.offer.estimatedTime) * 1000
                            : 0)
                        }
                        renderer={countdownRenderer}
                      />
                    )}
                  </>
                ) : (
                  <>
                    {!createdOrder ? (
                      <>{text}</>
                    ) : (
                      <Typography variant="body2">
                        Your {offer?.amount} {offer?.token} should arrive soon
                        in your wallet on{' '}
                        {getChainById(offer?.chainId || '', chains)?.label ||
                          ''}
                      </Typography>
                    )}
                  </>
                )}

                {createdOrder?.hash && (
                  <TransactionID
                    value={createdOrder.hash}
                    label="Order ID"
                    link={orderLink}
                    containerComponent="span"
                    containerStyle={{
                      display: 'inline-flex',
                      gap: '2px',
                      marginBottom: '12px',
                      marginTop: '16px',
                      '& .MuiIconButton-root svg': {
                        color: '#F57F21',
                      },
                    }}
                    labelStyle={{
                      color: '#0B0D17',
                      fontSize: '16px',
                      fontWeight: '700',
                    }}
                    valueStyle={{
                      color: '#0B0D17',
                      fontSize: '16px',
                      fontWeight: '400',
                    }}
                    startLength={10}
                    endLength={10}
                    buttonStyle={{
                      padding: '0 1px',
                    }}
                  />
                )}
              </Box>
              {onEmailSubmit && (
                <Box sx={{ marginTop: '24px', maxWidth: '332px' }}>
                  <EmailNotificationForm onSubmit={onEmailSubmit} />
                </Box>
              )}
            </Box>
            <Box>
              <Stack
                direction="row"
                alignItems="stretch"
                justifyContent="space-between"
              >
                <CardTitle sx={{ flex: 1 }}>You pay</CardTitle>

                <CardTitle sx={{ flex: 1 }}>You receive</CardTitle>
              </Stack>

              <Box display={'flex'} flexDirection={'row'}></Box>
              <Stack
                direction="row"
                alignItems="stretch"
                justifyContent="space-between"
              >
                <ChainTokenBox
                  style={{
                    flex: 1,
                    paddingLeft: '16px',
                    height: 'auto',
                  }}
                  avatar={
                    <Badge
                      overlap="circular"
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                      badgeContent={
                        exchangeChain && exchangeChain.label ? (
                          <Avatar
                            src={exchangeChain.icon}
                            alt={exchangeChain.label}
                            sx={{
                              width: '16px',
                              height: '16px',
                              border: '2px solid #fff',
                              background: '#fff',
                            }}
                          >
                            {exchangeChain.label}
                          </Avatar>
                        ) : (
                          <AvatarDefault
                            width={16}
                            height={16}
                            sx={{ border: '2px solid #fff' }}
                          />
                        )
                      }
                    >
                      {exchangeToken ? (
                        <Avatar
                          sx={{ width: '32px', height: '32px' }}
                          src={exchangeToken.icon}
                          alt={exchangeToken.symbol || offer?.token || ''}
                        >
                          {exchangeToken.symbol || offer?.token || ''}
                        </Avatar>
                      ) : (
                        <AvatarDefault width={32} height={32} />
                      )}
                    </Badge>
                  }
                  title={
                    <Box
                      style={{
                        whiteSpace: 'pre-wrap',
                        color: '#000',
                      }}
                      mb={'3px'}
                    >
                      {!offerAmount ? <Skeleton /> : <>{offerAmount}</>}
                    </Box>
                  }
                  subheader={
                    <span style={{ whiteSpace: 'pre-wrap' }}>
                      {offerAmount && exchangeToken && exchangeChain ? (
                        `${exchangeToken.symbol} on ${exchangeChain.label}`
                      ) : (
                        <Skeleton />
                      )}
                    </span>
                  }
                  selected={true}
                  compact={false}
                />
                {offerChain && offerToken && (
                  <ChainTokenBox
                    style={{
                      paddingLeft: 0,
                      flex: 1,
                      height: 'auto',
                    }}
                    avatar={
                      <Badge
                        overlap="circular"
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'right',
                        }}
                        badgeContent={
                          offerChain ? (
                            <Avatar
                              src={offerChain.icon}
                              alt={offerChain.label}
                              sx={{
                                width: '16px',
                                height: '16px',
                                border: '2px solid #fff',
                                background: '#fff',
                              }}
                            >
                              {offerChain.label}
                            </Avatar>
                          ) : (
                            <AvatarDefault
                              width={16}
                              height={16}
                              sx={{ border: '2px solid #fff' }}
                            />
                          )
                        }
                      >
                        {offerToken ? (
                          <Avatar
                            sx={{ width: '32px', height: '32px' }}
                            src={offerToken.icon}
                            alt={offerToken.symbol || ''}
                          >
                            {offerToken.symbol || ''}
                          </Avatar>
                        ) : (
                          <AvatarDefault width={32} height={32} />
                        )}
                      </Badge>
                    }
                    title={
                      <Box
                        style={{
                          whiteSpace: 'pre-wrap',
                          color: '#000',
                        }}
                        mb={'3px'}
                      >
                        {!amount ? <Skeleton /> : <>{amount}</>}
                      </Box>
                    }
                    subheader={
                      <span style={{ whiteSpace: 'pre-wrap' }}>
                        {amount && offerToken && offerChain ? (
                          `${offerToken.symbol} on ${offerChain.label}`
                        ) : (
                          <Skeleton />
                        )}
                      </span>
                    }
                    selected={true}
                    compact={false}
                  />
                )}
              </Stack>
            </Box>
          </Stack>
          <Box sx={{ flex: 1 }}>
            <Box
              sx={{
                background: '#FFFFFF',
                boxShadow: '0px 10px 40px rgba(0, 0, 0, 0.04)',
                borderRadius: '20px',
                padding: '40px',
              }}
            >
              <Typography variant="h2" sx={{ margin: '0 0 24px', padding: 0 }}>
                Order Status
              </Typography>
              <Stepper
                activeStep={activeStep}
                orientation="vertical"
                sx={{
                  '& .MuiStep-root .MuiStepContent-root': {
                    borderColor: '#DCDCDC',
                  },
                  '& .MuiStep-root.Mui-completed .MuiStepContent-root': {
                    borderColor: '#F57F21',
                  },
                  '& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line':
                    {
                      borderColor: '#F57F21',
                    },
                  '& .MuiStepConnector-root.Mui-active .MuiStepConnector-line':
                    {
                      borderColor: '#F57F21',
                    },
                  '& .MuiStepConnector-root.Mui-disabled .MuiStepConnector-line':
                    {
                      borderColor: '#DCDCDC',
                    },
                  '& .MuiStepLabel-iconContainer': {
                    paddingRight: '6.5px',
                  },
                  '& .MuiStepLabel-label.Mui-disabled': {
                    color: '#979797',
                  },
                }}
              >
                {steps.map((step, index) => (
                  <Step
                    key={step.title}
                    expanded={true}
                    last={index === steps.length - 1}
                  >
                    <StepLabel
                      StepIconComponent={({ className }) => (
                        <Box className={className}>
                          {index === activeStep ? (
                            <Box
                              sx={{
                                width: '16px',
                                height: '16px',
                                borderRadius: '50%',
                                background: '#F57F21',
                                margin: '0 4.5px',
                                position: 'relative',
                              }}
                            >
                              <Box
                                sx={{
                                  position: 'absolute',
                                  width: '4px',
                                  height: '4px',
                                  borderRadius: '50%',
                                  background: '#ffffff',
                                  left: '50%',
                                  top: '50%',
                                  transform:
                                    'translateX(-50%) translateY(-50%)',
                                }}
                              />
                            </Box>
                          ) : (
                            <>
                              {index > activeStep ? (
                                <Box
                                  sx={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    background: '#DCDCDC',
                                    margin: '0 8.5px',
                                  }}
                                />
                              ) : (
                                <Box
                                  sx={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    background: '#F57F21',
                                    margin: '0 8.5px',
                                  }}
                                />
                              )}
                            </>
                          )}
                        </Box>
                      )}
                      sx={{
                        paddingTop: '4px',
                        paddingBottom: '4px',
                        '& .MuiStepLabel-label': {
                          fontWeight: '700',
                          fontSize: '16px',
                          lineHeight: '19px',
                        },
                      }}
                    >
                      <span
                        style={{
                          color: index === activeStep ? '#F57F21' : 'inherit',
                        }}
                      >
                        {index < activeStep
                          ? step.completed?.title || step.title
                          : step.title}
                      </span>
                      {step.subtitle ||
                        (index < activeStep && step.completed?.subtitle && (
                          <span
                            style={{
                              fontWeight: '400',
                              color: '#979797',
                              fontSize: '12px',
                            }}
                          >
                            {' '}
                            •{' '}
                            {index < activeStep
                              ? step.completed?.subtitle || step.subtitle
                              : step.subtitle}
                          </span>
                        ))}
                    </StepLabel>
                    <StepContent
                      sx={{
                        color: index <= activeStep ? '#0B0D17' : '#979797',
                        '& .MuiTypography-body1': {
                          fontWeight: '400',
                          fontSize: '14px',
                          lineHeight: '125%',
                          color: 'inherit',
                        },
                        '& .MuiIconButton-root svg': {
                          color: '#F57F21',
                        },
                      }}
                    >
                      {index < activeStep
                        ? step.completed?.content || step.content
                        : step.content}
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </Box>
          </Box>
        </Stack>
      )}
    </Dialog>
  );
};

export default OrderPlacingModalV2;
