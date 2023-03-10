import React from 'react';
import {
  Avatar,
  Badge,
  Box,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Card } from '../../Card';
import { SelectTokenCardHeader } from '../../SelectTokenButton/SelectTokenButton.style';
import { AvatarDefault } from '../../TokenAvatar';
import DexOfferBadge from './DexOfferBadge';
import { PowerSettingsNew as PowerSettingsNewIcon } from '@mui/icons-material';
import { Offer } from '../../../types/Offer';

export type OfferChain = {
  label: string;
  icon: string;
  token: string;
};

type Props = {
  offer: Offer;
  chain: OfferChain;
  isActivating?: string;
  onDeactivateClick: (offerId: string) => void;
  onActivateClick: (offerId: string) => void;
};

const DexOffer = (props: Props) => {
  const { offer, chain, isActivating, onDeactivateClick, onActivateClick } =
    props;
  return (
    <Card
      flex={1}
      style={{
        borderRadius: '12px',
        marginBottom: '12px',
        backgroundColor: '#fff',
      }}
    >
      <Box display={'flex'} flexDirection={'row'}>
        {!offer.isActive && (
          <DexOfferBadge className="secondary">Inactive</DexOfferBadge>
        )}
      </Box>

      <SelectTokenCardHeader
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
                  {chain.token}
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
            {offer.tokenIcon ? (
              <Avatar
                sx={{ width: '32px', height: '32px' }}
                src={offer.tokenIcon}
                alt={offer.token || offer.tokenAddress}
              >
                {offer.token || offer.tokenAddress}
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
        subheader={`${offer.token} on ${chain.label}`}
        selected={true}
        compact={false}
        action={
          <Box>
            {!isActivating || isActivating !== offer.id ? (
              <Tooltip title={offer.isActive ? 'Deactivate' : 'Activate'}>
                <IconButton
                  aria-label={offer.isActive ? 'Deactivate' : 'Activate'}
                  size="small"
                  onClick={() => {
                    if (offer.isActive) {
                      onDeactivateClick(offer.id);
                    } else {
                      onActivateClick(offer.id);
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
