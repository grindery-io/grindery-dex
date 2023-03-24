import React from 'react';
import {
  Avatar,
  Badge,
  Box,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import DexOfferBadge from './DexOfferBadge';
import { PowerSettingsNew as PowerSettingsNewIcon } from '@mui/icons-material';
import { Offer } from '../../../types/Offer';
import { Card } from '../../Card/Card';
import { ChainTokenBox } from '../../ChainTokenBox/ChainTokenBox';
import { AvatarDefault } from '../../Avatar/AvatarDefault';

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
  isActivating?: string;
  onDeactivateClick: (offerId: string) => void;
  onActivateClick: (offerId: string) => void;
};

const DexOffer = (props: Props) => {
  const {
    offer,
    chain,
    isActivating,
    onDeactivateClick,
    onActivateClick,
    token,
  } = props;
  return (
    <Card
      flex={1}
      style={{
        borderRadius: '12px',
        marginBottom: '12px',
        backgroundColor: offer.new ? 'rgba(245, 181, 255, 0.08)' : '#fff',
      }}
    >
      <Box display={'flex'} flexDirection={'row'}>
        {offer.new && <DexOfferBadge>New</DexOfferBadge>}
        {!offer.isActive && (
          <DexOfferBadge className="secondary">Inactive</DexOfferBadge>
        )}
      </Box>

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
            {`Min: ${parseFloat(offer.min).toLocaleString()}\nMax: ${parseFloat(
              offer.max
            ).toLocaleString()}`}
          </Box>
        }
        subheader={`${token.label} on ${chain.label}`}
        selected={true}
        compact={false}
        action={
          <Box>
            {!isActivating || isActivating !== offer._id ? (
              <Tooltip title={offer.isActive ? 'Deactivate' : 'Activate'}>
                <IconButton
                  disabled={Boolean(isActivating)}
                  aria-label={offer.isActive ? 'Deactivate' : 'Activate'}
                  size="small"
                  onClick={() => {
                    if (offer.isActive) {
                      onDeactivateClick(offer._id);
                    } else {
                      onActivateClick(offer._id);
                    }
                  }}
                >
                  <PowerSettingsNewIcon
                    sx={{ color: 'black' }}
                    fontSize="inherit"
                  />
                </IconButton>
              </Tooltip>
            ) : (
              <span
                style={{
                  color: '#3f49e1',
                  padding: '5px',
                }}
              >
                <CircularProgress color="inherit" size={16} />
              </span>
            )}
          </Box>
        }
      />
    </Card>
  );
};

export default DexOffer;
