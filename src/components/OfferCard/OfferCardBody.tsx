import React from 'react';
import { Avatar, Badge, Box, Skeleton, Stack, Typography } from '@mui/material';
import { Offer } from '../../types/Offer';
import { Chain } from '../../types/Chain';
import { TokenType } from '../../types/TokenType';
import { ChainTokenBox } from '../ChainTokenBox/ChainTokenBox';
import { AvatarDefault } from '../Avatar/AvatarDefault';
import useShopPage from '../../hooks/useShopPage';

type Props = {
  offer: Offer;
  offerChain?: Chain;
  offerToken?: TokenType;
};

const OfferCardBody = (props: Props) => {
  const { offer, offerChain, offerToken } = props;
  const { currentFromChain, fromToken, tokenPrice } = useShopPage();

  const fromAmount =
    offer.amount && offer.exchangeRate
      ? parseFloat(offer.amount) * parseFloat(offer.exchangeRate)
      : 0;

  const price = tokenPrice ? fromAmount * tokenPrice : 0;

  return (
    <Box>
      <Box sx={{ padding: '24px 24px 0' }}>
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
                  fontSize: '22px',
                  lineHeight: '27px',
                  display: '-webkit-box',
                  '-webkit-line-clamp': '2',
                  '-webkit-box-orient': 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                title={offer.title.length > 25 ? offer.title : undefined}
              >
                {offer.title}
              </Typography>
            )}
            {offerChain && offerToken ? (
              <ChainTokenBox
                sx={{
                  flex: 1,
                  paddingLeft: '0',
                  height: 'auto',
                  alignItems: 'flex-start',
                  marginBottom: 0,
                  paddingBottom: 0,
                  '& .MuiCardHeader-avatar': {
                    marginRight: '8px',
                  },
                  '& .MuiCardHeader-title': {
                    fontWeight: '700',
                    fontSize: '28px',
                    lineHeight: '23px',
                    margin: '0 0 10px',
                    padding: 0,
                    '& span': {
                      color: '#808898',
                      fontWeight: '400',
                    },
                  },
                  '& .MuiCardHeader-subheader': {
                    fontWeight: '500',
                    fontSize: '14px',
                    lineHeight: '12px',
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
                      offerChain.label ? (
                        <Avatar
                          src={offerChain.icon}
                          alt={offerChain.label}
                          sx={{
                            width: '11.5px',
                            height: '11.5px',
                            border: '2px solid #fff',
                            background: '#fff',
                          }}
                        >
                          {offerChain.label}
                        </Avatar>
                      ) : (
                        <AvatarDefault
                          width={11.5}
                          height={11.5}
                          sx={{ border: '2px solid #fff' }}
                        />
                      )
                    }
                  >
                    {offerToken ? (
                      <Avatar
                        sx={{ width: '23px', height: '23px' }}
                        src={offerToken.icon}
                        alt={offerToken.symbol || offer.token || ''}
                      >
                        {offerToken.symbol || offer.token || ''}
                      </Avatar>
                    ) : (
                      <AvatarDefault width={23} height={23} />
                    )}
                  </Badge>
                }
                title={
                  offer.amount ? (
                    <>
                      {`${parseFloat(parseFloat(offer.amount).toFixed(6))} `}
                      <span>{offerToken.symbol}</span>
                    </>
                  ) : null
                }
                subheader={
                  <span style={{ whiteSpace: 'pre-wrap' }}>
                    {offer.amount ? `on ${offerChain.label}` : <Skeleton />}
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
      <Box sx={{ margin: '16px 24px 0', padding: '12px 16px' }}>
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
            {currentFromChain && fromToken ? (
              <ChainTokenBox
                style={{
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
                      currentFromChain.label ? (
                        <Avatar
                          src={currentFromChain.icon}
                          alt={currentFromChain.label}
                          sx={{
                            width: '16px',
                            height: '16px',
                            border: '2px solid #fff',
                            background: '#fff',
                          }}
                        >
                          {currentFromChain.label}
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
                title={
                  fromToken.symbol ? (
                    <Box
                      style={{
                        whiteSpace: 'pre-wrap',
                        color: offer.isActive ? '#000' : '#aaa',
                      }}
                      mb={'3px'}
                    >
                      {fromToken.symbol}
                    </Box>
                  ) : null
                }
                subheader={
                  <span style={{ whiteSpace: 'pre-wrap' }}>
                    {offer.amount ? (
                      `on ${currentFromChain.label}`
                    ) : (
                      <Skeleton />
                    )}
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
                price ? (
                  `US$${parseFloat(price.toFixed(4))}`
                ) : (
                  <Skeleton width="70px" />
                )
              }
              subheader={
                fromAmount ? (
                  `${parseFloat(fromAmount.toFixed(6))} ETH`
                ) : (
                  <Skeleton />
                )
              }
              selected={true}
              compact={false}
            />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default OfferCardBody;
