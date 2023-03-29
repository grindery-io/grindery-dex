import React, { useEffect, useState } from 'react';
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
  StepIconProps,
  StepLabel,
  Stepper,
  styled,
  Tooltip,
} from '@mui/material';
import { Offer } from '../../types/Offer';
import { Card } from '../Card/Card';
import { CardTitle } from '../Card/CardTitle';
import { ChainTokenBox } from '../ChainTokenBox/ChainTokenBox';
import { AvatarDefault } from '../Avatar/AvatarDefault';
import EvStationIcon from '@mui/icons-material/EvStation';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import LayersIcon from '@mui/icons-material/Layers';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useGrinderyChains from '../../hooks/useGrinderyChains';
import { Chain } from '../../types/Chain';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { formatAddress } from '../../utils/address';
import { LiquidityWallet } from '../../types/LiquidityWallet';
import axios from 'axios';
import { DELIGHT_API_URL } from '../../constants';
import { useGrinderyNexus } from 'use-grindery-nexus';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import DexCardSubmitButton from '../DexCard/DexCardSubmitButton';

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
  offer: Offer;
  chain: OfferChain;
  token: OfferToken;
  onClick?: (offer: Offer) => void;
  fromAmount?: string;
  label?: string;
  toTokenPrice?: number | null;
  fromTokenPrice?: number | null;
  compact?: boolean;
  defaultProvider?: LiquidityWallet;
  userType?: 'a' | 'b';
  isActivating?: string;
  onDeactivateClick?: (offerId: string) => void;
  onActivateClick?: (offerId: string) => void;
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
    chain,
    token,
    onClick,
    fromAmount,
    label,
    toTokenPrice,
    fromTokenPrice,
    compact,
    defaultProvider,
    userType,
    isActivating,
    onDeactivateClick,
    onActivateClick,
  } = props;
  const { token: userToken } = useGrinderyNexus();

  const isUserA = !userType || userType === 'a';

  const params = {
    headers: {
      Authorization: `Bearer ${userToken?.access_token || ''}`,
    },
  };

  const { chains } = useGrinderyChains();

  const amount = isUserA
    ? toTokenPrice &&
      fromTokenPrice &&
      fromAmount &&
      offer &&
      offer.exchangeRate
      ? parseFloat(fromAmount) / parseFloat(offer.exchangeRate)
      : 0
    : `${parseFloat(offer.min).toLocaleString()} — ${parseFloat(
        offer.max
      ).toLocaleString()}`;

  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [provider, setProvider] = useState<LiquidityWallet | null>(
    defaultProvider || null
  );

  const explorerLink = offer.hash
    ? (
        chains.find((c: Chain) => c.value === `eip155:5`)
          ?.transactionExplorerUrl || ''
      ).replace('{hash}', offer.hash || '')
    : '';

  const providerLink = offer.hash
    ? (
        chains.find((c: Chain) => c.chainId === offer.chainId)
          ?.addressExplorerUrl || ''
      ).replace('{hash}', provider?.walletAddress || '')
    : '';

  const getProvider = async () => {
    const providerRes = await axios.get(
      `${DELIGHT_API_URL}/liquidity-wallets/single?chainId=${offer.chainId}&userId=${offer.userId}`,
      params
    );
    setProvider(providerRes?.data || null);
  };

  const handleExpandClick: React.MouseEventHandler<HTMLButtonElement> = (
    event
  ) => {
    event.stopPropagation();
    setExpanded(!expanded);
  };

  useEffect(() => {
    if (!defaultProvider) {
      if (compact) {
        if (expanded && !provider) {
          getProvider();
        }
      } else {
        if (!provider) {
          getProvider();
        }
      }
    } else {
      setProvider(defaultProvider);
    }
  }, [compact, expanded, provider, defaultProvider]);

  return (
    <Card
      flex={1}
      sx={{
        borderRadius: '12px',
        marginBottom: '12px',
        backgroundColor: offer.new ? 'rgba(245, 181, 255, 0.08)' : '#fff',
        '&:hover': {
          backgroundColor: onClick ? 'rgb(249, 249, 249)' : '#fff',
        },
      }}
      onClick={
        onClick && amount
          ? () => {
              onClick(offer);
            }
          : undefined
      }
    >
      {compact && (
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
              gap="3px"
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
            >
              <EvStationIcon
                fontSize="small"
                sx={{ marginTop: '-2px', color: 'rgba(0, 0, 0, 0.24)' }}
              />
              <p style={{ color: offer.isActive ? '#000' : '#aaa' }}>$2.5</p>
            </Stack>
          </Tooltip>
          <Tooltip title="Chains">
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-start"
              gap="3px"
            >
              <LayersIcon
                fontSize="small"
                sx={{ marginTop: '-2px', color: 'rgba(0, 0, 0, 0.24)' }}
              />
              <p style={{ color: offer.isActive ? '#000' : '#aaa' }}>1</p>
            </Stack>
          </Tooltip>
        </Stack>
      )}
      {label && <CardTitle>{label}</CardTitle>}

      <Box display={'flex'} flexDirection={'row'}></Box>

      <ChainTokenBox
        style={{ height: 'auto' }}
        avatar={
          <Badge
            overlap="circular"
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            badgeContent={
              chain.label ? (
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
                alt={token.label || offer.token || ''}
              >
                {token.label || offer.token || ''}
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
                  <>{amount.toFixed(6).toLocaleString()}</>
                )}

                {typeof amount === 'string' && <>{amount}</>}
              </>
            )}
          </Box>
        }
        subheader={
          <span style={{ whiteSpace: 'pre-wrap' }}>
            {amount ? (
              `${token.label} on ${chain.label}.\n1 ${
                token.label
              } = ${offer.exchangeRate?.toLocaleString()} ${
                offer.exchangeToken
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
            <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>
          ) : undefined
        }
      />
      {compact ? (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box p="0 16px 16px">
            {provider?.walletAddress ? (
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-start"
                gap="4px"
                mb="4px"
              >
                <span style={{ color: 'rgb(116, 116, 116)', fontSize: '14px' }}>
                  Provider:{' '}
                  {formatAddress(provider?.walletAddress || '', 10, 10)}
                </span>

                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="flex-start"
                >
                  <Tooltip
                    title={copied ? 'Copied' : 'Copy to clipboard'}
                    onClose={() => {
                      setTimeout(() => {
                        setCopied(false);
                      }, 300);
                    }}
                  >
                    <IconButton
                      size="small"
                      sx={{ fontSize: '14px', color: '#3f49e1' }}
                      onClick={(event: any) => {
                        event.stopPropagation();
                        navigator.clipboard.writeText(
                          provider?.walletAddress || ''
                        );
                        setCopied(true);
                      }}
                    >
                      <ContentCopyIcon fontSize="inherit" />
                    </IconButton>
                  </Tooltip>
                  {providerLink && (
                    <Tooltip title="View on blockchain explorer">
                      <IconButton
                        size="small"
                        sx={{ fontSize: '14px', color: '#3f49e1' }}
                        onClick={(event: any) => {
                          event.stopPropagation();
                          window.open(providerLink, '_blank');
                        }}
                      >
                        <OpenInNewIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Stack>
              </Stack>
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

            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-start"
              gap="4px"
            >
              <span style={{ color: 'rgb(116, 116, 116)', fontSize: '14px' }}>
                Offer ID: {formatAddress(offer.hash || '', 10, 10)}
              </span>

              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-start"
              >
                <Tooltip
                  title={copied ? 'Copied' : 'Copy to clipboard'}
                  onClose={() => {
                    setTimeout(() => {
                      setCopied(false);
                    }, 300);
                  }}
                >
                  <IconButton
                    size="small"
                    sx={{ fontSize: '14px', color: '#3f49e1' }}
                    onClick={(event: any) => {
                      event.stopPropagation();
                      navigator.clipboard.writeText(offer.hash || '');
                      setCopied(true);
                    }}
                  >
                    <ContentCopyIcon fontSize="inherit" />
                  </IconButton>
                </Tooltip>
                {explorerLink && (
                  <Tooltip title="View on blockchain explorer">
                    <IconButton
                      size="small"
                      sx={{ fontSize: '14px', color: '#3f49e1' }}
                      onClick={(event: any) => {
                        event.stopPropagation();
                        window.open(explorerLink, '_blank');
                      }}
                    >
                      <OpenInNewIcon fontSize="inherit" />
                    </IconButton>
                  </Tooltip>
                )}
              </Stack>
            </Stack>
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
                      color: offer.isActive ? '#FF5858' : '#00B674',
                      '&:hover': {
                        backgroundColor: offer.isActive ? '#FF5858' : '#00B674',
                        border: `1px solid ${
                          offer.isActive ? '#FF5858' : '#00B674'
                        }`,
                        color: '#ffffff',
                      },
                    },
                  }}
                >
                  <DexCardSubmitButton
                    loading={isActivating === offer._id}
                    disabled={Boolean(isActivating)}
                    label={offer.isActive ? 'Deactivate' : 'Activate'}
                    onClick={() => {
                      if (offer.isActive) {
                        onDeactivateClick(offer._id);
                      } else {
                        onActivateClick(offer._id);
                      }
                    }}
                  />
                </Box>
              </Box>
            )}
          </Box>
        </Collapse>
      ) : (
        <>
          <Stepper
            orientation="vertical"
            activeStep={-1}
            sx={{
              padding: '0 16px',
              //'& .MuiStepConnector-root': { display: 'none' },
              '& .MuiStepConnector-line': {
                minHeight: '12px',
              },
              '& .MuiStepLabel-root': {
                paddingBottom: '5px',
              },
            }}
          >
            <Step expanded>
              <StepLabel StepIconComponent={StepCustomIcon}>
                Estimated gas fee: $2.5
              </StepLabel>
            </Step>
            <Step expanded>
              <StepLabel StepIconComponent={StepCustomIcon}>
                Price impact: 0
              </StepLabel>
            </Step>
            <Step expanded>
              <StepLabel StepIconComponent={StepCustomIcon}>
                Time to execute: {offer.estimatedTime}s
              </StepLabel>
            </Step>
          </Stepper>
          <Box p="16px">
            {provider?.walletAddress ? (
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-start"
                gap="4px"
                mb="4px"
              >
                <Tooltip title={`Provider: ${provider?.walletAddress || ''}`}>
                  <span
                    style={{ color: 'rgb(116, 116, 116)', fontSize: '14px' }}
                  >
                    Provider:{' '}
                    {formatAddress(provider?.walletAddress || '', 10, 10)}
                  </span>
                </Tooltip>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="flex-start"
                >
                  <Tooltip
                    title={copied ? 'Copied' : 'Copy to clipboard'}
                    onClose={() => {
                      setTimeout(() => {
                        setCopied(false);
                      }, 300);
                    }}
                  >
                    <IconButton
                      size="small"
                      sx={{ fontSize: '14px', color: '#3f49e1' }}
                      onClick={(event: any) => {
                        event.stopPropagation();
                        navigator.clipboard.writeText(
                          provider?.walletAddress || ''
                        );
                        setCopied(true);
                      }}
                    >
                      <ContentCopyIcon fontSize="inherit" />
                    </IconButton>
                  </Tooltip>
                  {providerLink && (
                    <Tooltip title="View on blockchain explorer">
                      <IconButton
                        size="small"
                        sx={{ fontSize: '14px', color: '#3f49e1' }}
                        onClick={(event: any) => {
                          event.stopPropagation();
                          window.open(providerLink, '_blank');
                        }}
                      >
                        <OpenInNewIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Stack>
              </Stack>
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

            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-start"
              gap="4px"
            >
              <Tooltip title={`Offer ID: ${offer.hash || ''}`}>
                <span style={{ color: 'rgb(116, 116, 116)', fontSize: '14px' }}>
                  Offer ID: {formatAddress(offer.hash || '', 10, 10)}
                </span>
              </Tooltip>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-start"
              >
                <Tooltip
                  title={copied ? 'Copied' : 'Copy to clipboard'}
                  onClose={() => {
                    setTimeout(() => {
                      setCopied(false);
                    }, 300);
                  }}
                >
                  <IconButton
                    size="small"
                    sx={{ fontSize: '14px', color: '#3f49e1' }}
                    onClick={(event: any) => {
                      event.stopPropagation();
                      navigator.clipboard.writeText(offer.hash || '');
                      setCopied(true);
                    }}
                  >
                    <ContentCopyIcon fontSize="inherit" />
                  </IconButton>
                </Tooltip>
                {explorerLink && (
                  <Tooltip title="View on blockchain explorer">
                    <IconButton
                      size="small"
                      sx={{ fontSize: '14px', color: '#3f49e1' }}
                      onClick={(event: any) => {
                        event.stopPropagation();
                        window.open(explorerLink, '_blank');
                      }}
                    >
                      <OpenInNewIcon fontSize="inherit" />
                    </IconButton>
                  </Tooltip>
                )}
              </Stack>
            </Stack>
          </Box>
        </>
      )}
    </Card>
  );
};

function StepCustomIcon(props: StepIconProps) {
  const { className } = props;

  const icons: { [index: string]: React.ReactElement } = {
    1: <EvStationIcon sx={{ color: 'rgba(0, 0, 0, 0.7)' }} />,
    2: <MonetizationOnIcon sx={{ color: 'rgba(0, 0, 0, 0.7)' }} />,
    3: <AccessTimeFilledIcon sx={{ color: 'rgba(0, 0, 0, 0.7)' }} />,
  };

  return <Box className={className}>{icons[String(props.icon)]}</Box>;
}

export default OfferPublic;
