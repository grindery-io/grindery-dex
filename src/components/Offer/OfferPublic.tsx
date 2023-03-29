import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Badge,
  Box,
  Collapse,
  IconButton,
  IconButtonProps,
  Skeleton,
  Stack,
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
  } = props;
  const { token: userToken } = useGrinderyNexus();

  const params = {
    headers: {
      Authorization: `Bearer ${userToken?.access_token || ''}`,
    },
  };

  const { chains } = useGrinderyChains();

  const amount =
    toTokenPrice && fromTokenPrice && fromAmount && offer && offer.exchangeRate
      ? parseFloat(fromAmount) / parseFloat(offer.exchangeRate)
      : 0;

  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [provider, setProvider] = useState<LiquidityWallet | null>(null);

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
    if (expanded && !provider) {
      getProvider();
    }
  }, [expanded, provider]);

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
            <p>{offer.estimatedTime}s</p>
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
            <p>$2.5</p>
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
            <p>1</p>
          </Stack>
        </Tooltip>
      </Stack>
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
            {amount ? <>{amount.toFixed(6).toLocaleString()}</> : <Skeleton />}
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
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        }
      />
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
              <Tooltip title={`Provider: ${provider?.walletAddress || ''}`}>
                <span style={{ color: 'rgb(116, 116, 116)', fontSize: '14px' }}>
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
      </Collapse>
    </Card>
  );
};

export default OfferPublic;
