import React from 'react';
import { Avatar, Badge, Box, Skeleton, Stack, Typography } from '@mui/material';
import { ChainTokenBox } from '../ChainTokenBox/ChainTokenBox';
import { AvatarDefault } from '../Avatar/AvatarDefault';
import {
  getOfferAmount,
  getOfferExchangeAmount,
  getOfferFromChain,
  getOfferFromToken,
  getOfferUSDAmount,
} from '../../utils';
import { OfferCardProps } from './OfferCard';

const OfferCardBody = (props: OfferCardProps) => {
  const { offer, fromToken, fromChain, tokenPrice, chains } = props;
  const chain = getOfferFromChain(offer, chains);
  const token = getOfferFromToken(offer, chains);
  const fromAmount = getOfferExchangeAmount(offer);
  const price = getOfferUSDAmount(offer, tokenPrice);

  return (
    <>
      <Box sx={{ padding: '16px 16px 0' }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-start"
          gap="10px"
        >
          {offer.image && (
            <Box
              sx={{
                background: '#FFF1D6',
                borderRadius: '12px',
                flex: 1,
                overflow: 'hidden',
                minWidth: 'calc(50% - 5px)',
                '& img': {
                  width: '100%',
                  maxWidth: '100%',
                  height: 'auto',
                  display: 'block',
                },
              }}
            >
              <img src={offer.image} alt="" />
            </Box>
          )}
          <Box sx={{ flex: 1, overflow: 'hidden' }}>
            <Typography
              sx={{
                fontWeight: '400',
                fontSize: '14px',
                lineHeight: '21px',
                margin: '0 0 8px',
              }}
            >
              You get
            </Typography>
            {offer.title && (
              <Typography
                sx={{
                  fontWeight: '700',
                  fontSize: '18px',
                  lineHeight: '22px',
                  display: '-webkit-box',
                  WebkitLineClamp: '2',
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                title={offer.title.length > 30 ? offer.title : undefined}
              >
                {offer.title}
              </Typography>
            )}
            {chain && token ? (
              <ChainTokenBox
                sx={{
                  flex: 1,
                  paddingLeft: '0',
                  height: 'auto',
                  alignItems: 'center',
                  paddingTop: '8px',
                  marginBottom: 0,
                  paddingBottom: 0,
                  '& .MuiCardHeader-avatar': {
                    marginRight: '8px',
                  },
                  '& .MuiCardHeader-title': {
                    fontWeight: '700',
                    fontSize: '18px',
                    lineHeight: '23px',
                    margin: '0',
                    padding: 0,
                    '& span': {
                      color: '#808898',
                      fontWeight: '400',
                    },
                  },
                  '& .MuiCardHeader-subheader': {
                    fontWeight: '500',
                    fontSize: '12px',
                    lineHeight: '17px',
                    margin: '0',
                    padding: 0,
                  },
                }}
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
                  offer.amount ? (
                    <>
                      {getOfferAmount(offer)}
                      <span> {token.symbol}</span>
                    </>
                  ) : null
                }
                subheader={
                  <span style={{ whiteSpace: 'pre-wrap' }}>
                    {offer.amount ? `on ${chain.label}` : <Skeleton />}
                  </span>
                }
                selected={true}
                compact={false}
              />
            ) : (
              <Skeleton
                variant="rounded"
                height="43px"
                sx={{ margin: '16px 0' }}
              />
            )}
          </Box>
        </Stack>
      </Box>
      <Box sx={{ marginTop: 'auto' }}>
        <Box sx={{ margin: '8px 16px 0', padding: '12px' }}>
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: '400',
              lineHeight: '21px',
            }}
          >
            You pay
          </Typography>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              {fromChain && fromToken ? (
                <ChainTokenBox
                  sx={{
                    paddingLeft: '0',
                    height: 'auto',
                    paddingTop: '8px',
                    paddingBottom: '0px',
                  }}
                  avatar={
                    <Badge
                      overlap="circular"
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                      badgeContent={
                        fromChain.label ? (
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
                          alt={fromToken.symbol || offer.token || ''}
                        >
                          {fromToken.symbol || offer.token || ''}
                        </Avatar>
                      ) : (
                        <AvatarDefault width={32} height={32} />
                      )}
                    </Badge>
                  }
                  title={fromToken.symbol || ''}
                  subheader={
                    <span style={{ whiteSpace: 'pre-wrap' }}>
                      {offer.amount ? `on ${fromChain.label}` : <Skeleton />}
                    </span>
                  }
                  selected={true}
                  compact={false}
                />
              ) : (
                <Skeleton
                  variant="rounded"
                  height="43px"
                  width="120px"
                  sx={{ margin: '8px 0 0' }}
                />
              )}
            </Box>
            <Box>
              <ChainTokenBox
                sx={{
                  paddingRight: '0',
                  height: 'auto',
                  paddingTop: '8px',
                  paddingBottom: '0px',
                  '& .MuiCardHeader-title': {
                    fontWeight: '700',
                  },
                  '& .MuiCardHeader-subheader': {
                    fontWeight: '500',
                  },
                }}
                title={
                  price !== '0' ? `US$${price}` : <Skeleton width="70px" />
                }
                subheader={
                  fromAmount !== '0' ? `${fromAmount} ETH` : <Skeleton />
                }
                selected={true}
                compact={false}
              />
            </Box>
          </Stack>
        </Box>
      </Box>
    </>
  );
};

export default OfferCardBody;
