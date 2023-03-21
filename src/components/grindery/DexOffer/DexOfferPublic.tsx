import React from 'react';
import { Avatar, Badge, Box } from '@mui/material';
import { Card } from '../../Card';
import { SelectTokenCardHeader } from '../../SelectTokenButton/SelectTokenButton.style';
import { AvatarDefault } from '../../TokenAvatar';
//import DexOfferBadge from './DexOfferBadge';
import { Offer } from '../../../types/Offer';

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
};

const DexOfferPublic = (props: Props) => {
  const { offer, chain, token } = props;
  return (
    <Card
      flex={1}
      style={{
        borderRadius: '12px',
        marginBottom: '12px',
        backgroundColor: offer.new ? 'rgba(245, 181, 255, 0.08)' : '#fff',
      }}
    >
      <Box display={'flex'} flexDirection={'row'}></Box>

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
      />
    </Card>
  );
};

export default DexOfferPublic;
