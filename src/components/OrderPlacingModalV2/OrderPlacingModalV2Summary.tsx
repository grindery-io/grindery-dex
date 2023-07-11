import React from 'react';
import { Box } from '@mui/system';
import { Avatar, Badge, Skeleton, Stack, Typography } from '@mui/material';
import { CardTitle, ChainTokenBox, AvatarDefault } from '..';
import { OrderStatusType } from '../../types';
import {
  getChainById,
  getOfferAmount,
  getOfferExchangeAmount,
  getOfferExchangeRate,
  getTokenBySymbol,
} from '../../utils';
import { OrderPlacingModalV2Props } from './OrderPlacingModalV2';

const OrderPlacingModalV2Summary = (props: OrderPlacingModalV2Props) => {
  const { createdOrder, chains, offer: selectedoffer, userAmount } = props;

  const offer = createdOrder?.offer || selectedoffer;

  const exchangeChain = getChainById(offer?.exchangeChainId || '', chains);
  const exchangeToken = getTokenBySymbol(
    offer?.exchangeToken || '',
    offer?.exchangeChainId || '',
    chains
  );
  const offerChain = getChainById(offer?.chainId || '', chains);
  const offerToken = getTokenBySymbol(
    offer?.token || '',
    offer?.chainId || '',
    chains
  );
  const amount = !userAmount
    ? offer
      ? getOfferExchangeAmount(offer)
      : '0'
    : userAmount;
  const offerAmount = !userAmount
    ? offer
      ? getOfferAmount(offer)
      : '0'
    : offer
    ? (
        parseFloat(userAmount) / parseFloat(getOfferExchangeRate(offer))
      ).toString()
    : '0';

  return (
    <>
      <Box>
        <Typography variant="h2" sx={{ margin: '0 0 16px', padding: 0 }}>
          Order Summary
        </Typography>
        <Stack
          direction="row"
          alignItems="stretch"
          justifyContent="space-between"
          sx={{ marginBottom: '8px' }}
        >
          <CardTitle sx={{ padding: '0 8px 0 0', flex: 1, fontWeight: '400' }}>
            {!createdOrder ? 'You will pay' : 'You paid'}
          </CardTitle>

          <CardTitle sx={{ padding: '0 0 0 8px', flex: 1, fontWeight: '400' }}>
            {!createdOrder || createdOrder.status !== OrderStatusType.COMPLETE
              ? 'You will receive'
              : 'You received'}
          </CardTitle>
        </Stack>
        <Stack
          direction="row"
          alignItems="stretch"
          justifyContent="space-between"
        >
          <ChainTokenBox
            style={{
              flex: 1,
              padding: '0 8px 0 0',
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
                  exchangeChain && exchangeChain.label ? (
                    <Avatar
                      src={exchangeChain.icon}
                      alt={exchangeChain.label}
                      sx={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid #F1F2F4',
                        background: '#F1F2F4',
                      }}
                    >
                      {exchangeChain.label}
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
                {exchangeToken ? (
                  <Avatar
                    sx={{ width: '32px', height: '32px' }}
                    src={exchangeToken.icon}
                    alt={exchangeToken.symbol || offer?.token || ''}
                  >
                    {exchangeToken.symbol || offer?.token || ''}
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
                  color: '#000',
                }}
                mb={'3px'}
              >
                {!amount ? <Skeleton /> : <>{amount}</>}
              </Box>
            }
            subheader={
              <span style={{ whiteSpace: 'pre-wrap' }}>
                {amount && exchangeToken && exchangeChain ? (
                  `${exchangeToken.symbol} on ${exchangeChain.label}`
                ) : (
                  <Skeleton />
                )}
              </span>
            }
            selected={true}
            compact={false}
          />
          {offerChain && offerToken && (
            <ChainTokenBox
              style={{
                padding: '0 0 0 8px',
                flex: 1,
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
                    offerChain ? (
                      <Avatar
                        src={offerChain.icon}
                        alt={offerChain.label}
                        sx={{
                          width: '16px',
                          height: '16px',
                          border: '2px solid #F1F2F4',
                          background: '#F1F2F4',
                        }}
                      >
                        {offerChain.label}
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
                  {offerToken ? (
                    <Avatar
                      sx={{ width: '32px', height: '32px' }}
                      src={offerToken.icon}
                      alt={offerToken.symbol || ''}
                    >
                      {offerToken.symbol || ''}
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
                    color: '#000',
                  }}
                  mb={'3px'}
                >
                  {!offerAmount ? <Skeleton /> : <>{offerAmount}</>}
                </Box>
              }
              subheader={
                <span style={{ whiteSpace: 'pre-wrap' }}>
                  {offerAmount && offerToken && offerChain ? (
                    `${offerToken.symbol} on ${offerChain.label}`
                  ) : (
                    <Skeleton />
                  )}
                </span>
              }
              selected={true}
              compact={false}
            />
          )}
        </Stack>
      </Box>
    </>
  );
};

export default OrderPlacingModalV2Summary;
