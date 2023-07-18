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
import { ChainType, OfferType } from '../../types';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import TransactionID from '../TransactionID/TransactionID';
import SwapHorizontalCircleIcon from '@mui/icons-material/SwapHorizontalCircle';
import {
  getOfferFromChain,
  getOfferFromToken,
  getOfferLink,
  getOfferProviderLink,
  getOfferToChain,
  getOfferToToken,
} from '../../utils';
import moment from 'moment';
import PageCardSubmitButton from '../PageCardSubmitButton/PageCardSubmitButton';

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
  onClick?: (offer: OfferType) => void;
  fromAmount?: string;
  containerStyle?: SxProps | React.CSSProperties;
  excludeSteps?: ('gas' | 'rate' | 'time' | 'impact')[];
  chains: ChainType[];
  advancedMode?: boolean;
  loading?: boolean;
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

const TradeOffer = (props: Props) => {
  const {
    offer,
    onClick,
    fromAmount,
    containerStyle,
    excludeSteps,
    chains,
    advancedMode,
    loading,
  } = props;

  const chain = getOfferFromChain(offer, chains);
  const token = getOfferFromToken(offer, chains);

  const payChain = getOfferToChain(offer, chains);
  const payToken = getOfferToToken(offer, chains);

  const amount =
    fromAmount && offer && offer.exchangeRate
      ? parseFloat(fromAmount) / parseFloat(offer.exchangeRate)
      : 0;

  const [expanded, setExpanded] = useState(false);

  const explorerLink = getOfferLink(offer, chains);

  const provider = offer.provider;

  const providerLink = getOfferProviderLink(offer, chains);

  const isInAdvancedMode = advancedMode !== undefined ? advancedMode : true;

  const handleExpandClick: React.MouseEventHandler<HTMLElement> = (event) => {
    event.stopPropagation();
    setExpanded(!expanded);
  };

  return (
    <Card
      className="TradeOffer"
      id={`offer-${offer.offerId}`}
      data-provider={offer.provider}
      flex={1}
      sx={{
        borderRadius: '12px',
        marginBottom: '12px',
        backgroundColor: offer.new ? 'rgba(245, 181, 255, 0.08)' : '#fff',
        '&:hover': {
          backgroundColor: onClick && !expanded ? 'rgb(249, 249, 249)' : '#fff',
        },
        ...(containerStyle || {}),
      }}
      onClick={
        !expanded ? handleExpandClick : undefined
        /*onClick && amount && !expanded
          ? () => {
              onClick(offer);
            }
          : undefined*/
      }
    >
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
        <Tooltip title="Execution time">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-start"
            gap="4px"
            id="execution-time-icon"
          >
            <AccessTimeFilledIcon
              fontSize="small"
              sx={{ marginTop: '-2px', color: 'rgba(0, 0, 0, 0.24)' }}
            />
            <p
              style={{ color: offer.isActive ? '#000' : '#aaa', lineHeight: 1 }}
            >
              {moment
                .duration(parseFloat(offer.estimatedTime || '0') * 1000)
                .humanize()}
            </p>
          </Stack>
        </Tooltip>
        {isInAdvancedMode && (
          <Tooltip title="Estimated network fee">
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-start"
              gap="4px"
              id="estimated-network-fee-icon"
            >
              <EvStationIcon
                fontSize="small"
                sx={{ marginTop: '-2px', color: 'rgba(0, 0, 0, 0.24)' }}
              />
              <p
                style={{
                  color: offer.isActive ? '#000' : '#aaa',
                  lineHeight: 1,
                }}
              >
                $2.5
              </p>
            </Stack>
          </Tooltip>
        )}
        {isInAdvancedMode && (
          <Tooltip title="Chains">
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-start"
              gap="4px"
              id="chains-icon"
            >
              <LayersIcon
                fontSize="small"
                sx={{ marginTop: '-2px', color: 'rgba(0, 0, 0, 0.24)' }}
              />
              <p
                style={{
                  color: offer.isActive ? '#000' : '#aaa',
                  lineHeight: 1,
                }}
              >
                1
              </p>
            </Stack>
          </Tooltip>
        )}
      </Stack>

      <Collapse in={expanded} timeout="auto">
        <Stack
          direction="row"
          alignItems="stretch"
          justifyContent="space-between"
          sx={{ transform: 'translateY(8px)' }}
        >
          <CardTitle sx={{ width: '98px' }}>Pay</CardTitle>
          <CardTitle sx={{ flex: 1.4 }}>Receive</CardTitle>
        </Stack>
      </Collapse>
      <Stack
        direction="row"
        alignItems="stretch"
        justifyContent="space-between"
      >
        <Collapse
          in={expanded}
          timeout="auto"
          orientation="horizontal"
          sx={{ maxWidth: '130px' }}
        >
          <Box sx={{ width: '130px', overflow: 'hidden' }}>
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
                    payChain && payChain.label ? (
                      <Avatar
                        src={payChain.icon}
                        alt={payChain.label}
                        sx={{
                          width: '16px',
                          height: '16px',
                          border: '2px solid #fff',
                          background: '#fff',
                        }}
                      >
                        {payChain.label}
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
                  {payToken ? (
                    <Avatar
                      sx={{ width: '32px', height: '32px' }}
                      src={payToken.icon}
                      alt={payToken.symbol || offer.exchangeToken || ''}
                    >
                      {payToken.symbol || offer.exchangeToken || ''}
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
                <span
                  style={{
                    whiteSpace: 'pre-wrap',
                    display: '-webkit-box',
                    WebkitLineClamp: '2',
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {fromAmount && payToken && payChain ? (
                    `${payToken.symbol} on ${payChain.label}`
                  ) : (
                    <Skeleton />
                  )}
                </span>
              }
              selected={true}
              compact={false}
            />
          </Box>
        </Collapse>

        <ChainTokenBox
          style={{
            flex: 1.4,
            paddingLeft: '16px',
            height: 'auto',
            order: '2',
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
            <span
              style={{
                whiteSpace: 'pre-wrap',
                display: '-webkit-box',
                WebkitLineClamp: '2',
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {amount && token && chain ? (
                `${token.symbol} on ${chain.label}`
              ) : (
                <Skeleton />
              )}
            </span>
          }
          selected={true}
          compact={false}
          action={
            <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
              id="expand_details"
            >
              <ExpandMoreIcon />
            </ExpandMore>
          }
        />
      </Stack>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
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
            {(!excludeSteps || !excludeSteps.includes('impact')) &&
              isInAdvancedMode && (
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

          <Box p="16px 16px 0 16px">
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
              value={offer.offerId || offer.hash || ''}
              label="Offer ID"
              link={explorerLink}
              valueStyle={{ color: '#000' }}
            />
            <PageCardSubmitButton
              label="Place order"
              onClick={() => {
                if (onClick && amount) {
                  onClick(offer);
                }
              }}
              loading={loading}
              disabled={loading}
            />
          </Box>
        </>
      </Collapse>
    </Card>
  );
};

export default TradeOffer;
