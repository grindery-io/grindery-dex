import React from 'react';
import {
  Avatar,
  Badge,
  Box,
  IconButton,
  Skeleton,
  Tooltip,
} from '@mui/material';
import { Offer } from '../../types/Offer';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Card } from '../Card/Card';
import { CardTitle } from '../Card/CardTitle';
import { ChainTokenBox } from '../ChainTokenBox/ChainTokenBox';
import { AvatarDefault } from '../Avatar/AvatarDefault';

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

  const amount =
    toTokenPrice && fromTokenPrice && fromAmount
      ? (parseFloat(fromAmount) * fromTokenPrice) / toTokenPrice
      : 0;

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
              } = $${toTokenPrice?.toLocaleString()}`
            ) : (
              <Skeleton />
            )}
          </span>
        }
        selected={true}
        compact={false}
        action={
          Boolean(onClick) && amount ? (
            <Tooltip title="Review offer">
              <IconButton>
                <KeyboardArrowRightIcon />
              </IconButton>
            </Tooltip>
          ) : undefined
        }
      />
    </Card>
  );
};

export default OfferPublic;
