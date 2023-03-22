import React from 'react';
import { Avatar, Badge, Box, IconButton, Tooltip } from '@mui/material';
import { Card, CardTitle } from '../../Card';
import { SelectTokenCardHeader } from '../../SelectTokenButton/SelectTokenButton.style';
import { AvatarDefault } from '../../TokenAvatar';
//import DexOfferBadge from './DexOfferBadge';
import { Offer } from '../../../types/Offer';
import useGrinderyChains from '../../../hooks/useGrinderyChains';
import { Chain } from '../../../types/Chain';
import { TokenType } from '../../../types/TokenType';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

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
  grt?: string;
  label?: string;
};

const DexOfferPublic = (props: Props) => {
  const { offer, chain, token, onClick, grt, label } = props;
  const { chains } = useGrinderyChains();
  const tokenPrice =
    chains
      .find((c: Chain) => c.label === chain.label)
      ?.tokens?.find((t: TokenType) => t.symbol === token.label)?.price || '1';

  const amount = grt
    ? (parseFloat(grt) / parseFloat(tokenPrice)).toString()
    : '1';

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
        onClick
          ? () => {
              onClick(offer);
            }
          : undefined
      }
    >
      {label && <CardTitle>{label}</CardTitle>}

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
            {parseFloat(amount).toLocaleString()}
          </Box>
        }
        subheader={`${token.label} on ${chain.label}`}
        selected={true}
        compact={false}
        action={
          Boolean(onClick) ? (
            <Tooltip title="Accept offer">
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

export default DexOfferPublic;
