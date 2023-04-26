import React, { useState } from 'react';
import {
  Avatar,
  Badge,
  Box,
  Chip,
  Collapse,
  IconButton,
  IconButtonProps,
  Skeleton,
  Stack,
  Step,
  StepLabel,
  Stepper,
  styled,
  SxProps,
  Tooltip,
} from '@mui/material';
import { Card } from '../Card/Card';
import { CardTitle } from '../Card/CardTitle';
import { ChainTokenBox } from '../ChainTokenBox/ChainTokenBox';
import { AvatarDefault } from '../Avatar/AvatarDefault';
import EvStationIcon from '@mui/icons-material/EvStation';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import LayersIcon from '@mui/icons-material/Layers';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ChainType, TokenType, OfferType } from '../../types';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import TransactionID from '../TransactionID/TransactionID';
import SwapHorizontalCircleIcon from '@mui/icons-material/SwapHorizontalCircle';
import {
  getOfferFromChain,
  getOfferFromToken,
  getOfferLink,
  getOfferProviderLink,
} from '../../utils';
import PageCardSubmitButton from '../PageCardSubmitButton/PageCardSubmitButton';
import moment from 'moment';

export type OfferChain = {
  label: string;
  icon: string;
  token: string;
};

export type OfferToken = {
  label: string;
  icon: string;
};

type Props = {
  offer: OfferType;
  fromChain?: ChainType | null;
  fromToken?: TokenType | '';
  onClick?: (offer: OfferType) => void;
  fromAmount?: string;
  label?: string;
  fromLabel?: string;
  compact?: boolean;
  userType?: 'a' | 'b';
  isActivating?: string;
  onDeactivateClick?: () => void;
  onActivateClick?: () => void;
  containerStyle?: SxProps | React.CSSProperties;
  excludeSteps?: ('gas' | 'rate' | 'time' | 'impact')[];
  calculateAmount?: boolean;
  chains: ChainType[];
  advancedMode?: boolean;
};

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} size="small" />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
  marginRight: '6px',
  backgroundColor: 'rgba(0, 0, 0, 0.04)',
}));

const OfferPublic = (props: Props) => {
  const {
    offer,
    onClick,
    fromAmount,
    label,
    fromLabel,
    compact,
    userType,
    isActivating,
    onDeactivateClick,
    onActivateClick,
    containerStyle,
    fromChain,
    fromToken,
    excludeSteps,
    calculateAmount,
    chains,
    advancedMode,
  } = props;
  const isUserA = !userType || userType === 'a';

  const chain = getOfferFromChain(offer, chains);
  const token = getOfferFromToken(offer, chains);

  const amount =
    isUserA || calculateAmount
      ? fromAmount && offer && offer.exchangeRate
        ? parseFloat(fromAmount) / parseFloat(offer.exchangeRate)
        : 0
      : `${parseFloat(offer.min).toLocaleString()} — ${parseFloat(
          offer.max
        ).toLocaleString()}`;

  const [expanded, setExpanded] = useState(false);

  const explorerLink = getOfferLink(offer, chains);

  const provider = offer.provider;

  const providerLink = getOfferProviderLink(offer, chains);

  const isInAdvancedMode = advancedMode !== undefined ? advancedMode : true;

  const handleExpandClick: React.MouseEventHandler<HTMLButtonElement> = (
    event
  ) => {
    event.stopPropagation();
    setExpanded(!expanded);
  };

  return (
    <Card
      className="OfferPublic"
      id={`offer-${offer.offerId}`}
      data-provider={offer.provider}
      flex={1}
      sx={{
        borderRadius: '12px',
        marginBottom: '12px',
        backgroundColor: offer.new ? 'rgba(245, 181, 255, 0.08)' : '#fff',
        '&:hover': {
          backgroundColor: onClick ? 'rgb(249, 249, 249)' : '#fff',
        },
        ...(containerStyle || {}),
      }}
      onClick={
        onClick && amount
          ? () => {
              onClick(offer);
            }
          : undefined
      }
    >
      {compact && (isInAdvancedMode || !isUserA) && (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            padding: '12px 16px 0',
            fontSize: '12px',
            '& p': {
              fontSize: '14px',
              margin: 0,
              padding: 0,
              lineHeight: 1,
              fontWeight: '500',
            },
          }}
        >
          {!offer.isActive && <Chip size="small" label="Inactive" />}
          {isInAdvancedMode && (
            <>
              <Tooltip title="Execution time">
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="flex-start"
                  gap="3px"
                  id="execution-time-icon"
                >
                  <AccessTimeFilledIcon
                    fontSize="small"
                    sx={{ marginTop: '-2px', color: 'rgba(0, 0, 0, 0.24)' }}
                  />
                  <p style={{ color: offer.isActive ? '#000' : '#aaa' }}>
                    {offer.estimatedTime}s
                  </p>
                </Stack>
              </Tooltip>
              <Tooltip title="Estimated network fee">
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="flex-start"
                  gap="3px"
                  id="estimated-network-fee-icon"
                >
                  <EvStationIcon
                    fontSize="small"
                    sx={{ marginTop: '-2px', color: 'rgba(0, 0, 0, 0.24)' }}
                  />
                  <p style={{ color: offer.isActive ? '#000' : '#aaa' }}>
                    $2.5
                  </p>
                </Stack>
              </Tooltip>
              <Tooltip title="Chains">
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="flex-start"
                  gap="3px"
                  id="chains-icon"
                >
                  <LayersIcon
                    fontSize="small"
                    sx={{ marginTop: '-2px', color: 'rgba(0, 0, 0, 0.24)' }}
                  />
                  <p style={{ color: offer.isActive ? '#000' : '#aaa' }}>1</p>
                </Stack>
              </Tooltip>
            </>
          )}
        </Stack>
      )}
      <Stack
        direction="row"
        alignItems="stretch"
        justifyContent="space-between"
      >
        {label && (
          <CardTitle
            sx={{ flex: 1, order: !userType || userType === 'a' ? '2' : '1' }}
          >
            {label}
          </CardTitle>
        )}
        {fromLabel && (
          <CardTitle
            sx={{ flex: 1, order: !userType || userType === 'a' ? '1' : '2' }}
          >
            {fromLabel}
          </CardTitle>
        )}
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
            paddingLeft:
              !compact && (!userType || userType === 'a') ? '0' : '16px',
            height: 'auto',
            order: !userType || userType === 'a' ? '2' : '1',
          }}
          avatar={
            <Badge
              overlap="circular"
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              badgeContent={
                chain && chain.label ? (
                  <Avatar
                    src={chain.icon}
                    alt={chain.label}
                    sx={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid #fff',
                      background: '#fff',
                    }}
                  >
                    {chain.label}
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
              {token ? (
                <Avatar
                  sx={{ width: '32px', height: '32px' }}
                  src={token.icon}
                  alt={token.symbol || offer.token || ''}
                >
                  {token.symbol || offer.token || ''}
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
                color: offer.isActive ? '#000' : '#aaa',
              }}
              mb={'3px'}
            >
              {!amount ? (
                <Skeleton />
              ) : (
                <>
                  {typeof amount === 'number' && (
                    <>{parseFloat(amount.toFixed(6)).toString()}</>
                  )}

                  {typeof amount === 'string' && <>{amount}</>}
                </>
              )}
            </Box>
          }
          subheader={
            <span style={{ whiteSpace: 'pre-wrap' }}>
              {amount && token && chain ? (
                `${token.symbol} on ${chain.label}.${
                  compact
                    ? `\n1 ${
                        token.symbol
                      } = ${offer.exchangeRate?.toLocaleString()} ${
                        offer.exchangeToken
                      }`
                    : ''
                }`
              ) : (
                <Skeleton />
              )}
            </span>
          }
          selected={true}
          compact={false}
          action={
            compact ? (
              <>
                {isInAdvancedMode && (
                  <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                    id="expand_details"
                  >
                    <ExpandMoreIcon />
                  </ExpandMore>
                )}
              </>
            ) : undefined
          }
        />
        {!compact && fromChain && fromToken && (
          <ChainTokenBox
            style={{
              paddingLeft: !userType || userType === 'a' ? '16px' : '0',
              flex: 1,
              height: 'auto',
              order: !userType || userType === 'a' ? '1' : '2',
            }}
            avatar={
              <Badge
                overlap="circular"
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                badgeContent={
                  fromChain ? (
                    <Avatar
                      src={fromChain.icon}
                      alt={fromChain.label}
                      sx={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid #fff',
                        background: '#fff',
                      }}
                    >
                      {fromChain.label}
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
                {fromToken ? (
                  <Avatar
                    sx={{ width: '32px', height: '32px' }}
                    src={fromToken.icon}
                    alt={fromToken.symbol || ''}
                  >
                    {fromToken.symbol || ''}
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
                  color: offer.isActive ? '#000' : '#aaa',
                }}
                mb={'3px'}
              >
                {!fromAmount ? (
                  <Skeleton />
                ) : (
                  <>
                    {parseFloat(parseFloat(fromAmount).toFixed(6)).toString()}
                  </>
                )}
              </Box>
            }
            subheader={
              <span style={{ whiteSpace: 'pre-wrap' }}>
                {fromAmount && fromToken && fromChain ? (
                  `${fromToken.symbol} on ${fromChain.label}`
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
      {compact ? (
        <>
          {isInAdvancedMode && (
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <Box p="0 16px 16px">
                {provider ? (
                  <TransactionID
                    value={provider || ''}
                    label="Merchant"
                    link={providerLink}
                  />
                ) : (
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="flex-start"
                    gap="4px"
                    mb="4px"
                    sx={{ minHeight: '24px' }}
                  >
                    <Skeleton width="220px" />
                    <Skeleton width="16px" />
                    <Skeleton width="16px" />
                  </Stack>
                )}
                <TransactionID
                  value={offer.hash || ''}
                  label="Offer ID"
                  link={explorerLink}
                />
                {!isUserA && onActivateClick && onDeactivateClick && (
                  <Box>
                    <Box
                      sx={{
                        padding: '6px 0 0',
                        '& > div': { paddingBottom: '0' },
                        '& button': {
                          margin: 0,
                          fontSize: '13px',
                          padding: '8px 20px',
                          backgroundColor: 'transparent',
                          border: `1px solid ${
                            offer.isActive ? '#FF5858' : '#00B674'
                          }`,
                          color: offer.isActive
                            ? '#FF5858 !important'
                            : '#00B674 !important',
                          '&:hover': {
                            backgroundColor: offer.isActive
                              ? '#FF5858'
                              : '#00B674',
                            border: `1px solid ${
                              offer.isActive ? '#FF5858' : '#00B674'
                            }`,
                            color: '#ffffff !important',
                          },
                        },
                      }}
                    >
                      <PageCardSubmitButton
                        loading={isActivating === offer.offerId}
                        disabled={Boolean(isActivating)}
                        label={offer.isActive ? 'Deactivate' : 'Activate'}
                        onClick={() => {
                          if (offer.isActive) {
                            onDeactivateClick();
                          } else {
                            onActivateClick();
                          }
                        }}
                      />
                    </Box>
                  </Box>
                )}
              </Box>
            </Collapse>
          )}
        </>
      ) : (
        <>
          <Stepper
            orientation="vertical"
            activeStep={-1}
            sx={{
              padding: '0 16px 8px',
              '& .MuiStepConnector-line': {
                minHeight: '12px',
              },
              '& .MuiStepLabel-root': {
                paddingBottom: '5px',
              },
            }}
          >
            {(!excludeSteps || !excludeSteps.includes('rate')) && (
              <Step expanded>
                <StepLabel
                  StepIconComponent={({ className }) => (
                    <Box className={className}>
                      <SwapHorizontalCircleIcon
                        sx={{ color: 'rgba(0, 0, 0, 0.7)' }}
                      />
                    </Box>
                  )}
                >
                  Exchange rate:{' '}
                  <strong>
                    1 {token?.symbol || ''} ={' '}
                    {offer.exchangeRate?.toLocaleString()} {offer.exchangeToken}
                  </strong>
                </StepLabel>
              </Step>
            )}
            {(!excludeSteps || !excludeSteps.includes('gas')) &&
              isInAdvancedMode && (
                <Step expanded>
                  <StepLabel
                    StepIconComponent={({ className }) => (
                      <Box className={className}>
                        <EvStationIcon sx={{ color: 'rgba(0, 0, 0, 0.7)' }} />
                      </Box>
                    )}
                  >
                    Estimated gas fee: <strong>$2.5</strong>
                  </StepLabel>
                </Step>
              )}
            {(!excludeSteps || !excludeSteps.includes('impact')) && (
              <Step expanded>
                <StepLabel
                  StepIconComponent={({ className }) => (
                    <Box className={className}>
                      <MonetizationOnIcon
                        sx={{ color: 'rgba(0, 0, 0, 0.7)' }}
                      />
                    </Box>
                  )}
                >
                  Price impact: <strong>0</strong>
                </StepLabel>
              </Step>
            )}
            {(!excludeSteps || !excludeSteps.includes('time')) && (
              <Step expanded>
                <StepLabel
                  StepIconComponent={({ className }) => (
                    <Box className={className}>
                      <AccessTimeFilledIcon
                        sx={{ color: 'rgba(0, 0, 0, 0.7)' }}
                      />
                    </Box>
                  )}
                >
                  Time to execute:{' '}
                  <strong>
                    {moment
                      .duration(parseFloat(offer.estimatedTime || '0') * 1000)
                      .humanize()}
                  </strong>
                </StepLabel>
              </Step>
            )}
          </Stepper>
          {isInAdvancedMode && (
            <Box p="16px">
              {provider ? (
                <TransactionID
                  value={provider || ''}
                  label="Merchant"
                  link={providerLink}
                  valueStyle={{ color: '#000' }}
                />
              ) : (
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="flex-start"
                  gap="4px"
                  mb="4px"
                  sx={{ minHeight: '24px' }}
                >
                  <Skeleton width="220px" />
                  <Skeleton width="16px" />
                  <Skeleton width="16px" />
                </Stack>
              )}
              <TransactionID
                value={offer.hash || ''}
                label="Offer ID"
                link={explorerLink}
                valueStyle={{ color: '#000' }}
              />
            </Box>
          )}
        </>
      )}
    </Card>
  );
};

export default OfferPublic;
