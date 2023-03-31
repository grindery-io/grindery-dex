import {
  Avatar,
  Badge,
  Box,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Offer } from '../../types/Offer';
import { Chain } from '../../types/Chain';
import { TokenType } from '../../types/TokenType';
import { DELIGHT_API_URL } from '../../constants';
import axios from 'axios';
import { useGrinderyNexus } from 'use-grindery-nexus';
import { LiquidityWallet } from '../../types/LiquidityWallet';
import useGrinderyChains from '../../hooks/useGrinderyChains';
import TransactionID from '../TransactionID/TransactionID';
import { ChainTokenBox } from '../ChainTokenBox/ChainTokenBox';
import { AvatarDefault } from '../Avatar/AvatarDefault';
import useShopPage from '../../hooks/useShopPage';
import DexCardSubmitButton from '../DexCard/DexCardSubmitButton';
import GavelIcon from '@mui/icons-material/Gavel';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

type Props = {
  offer: Offer;
  offerChain?: Chain;
  offerToken?: TokenType;
};

const OfferCard = (props: Props) => {
  const { token: userToken } = useGrinderyNexus();
  const { offer, offerChain, offerToken } = props;
  const { chains } = useGrinderyChains();
  const { currentFromChain, fromToken } = useShopPage();

  const [provider, setProvider] = useState<LiquidityWallet | null>(null);

  const params = {
    headers: {
      Authorization: `Bearer ${userToken?.access_token || ''}`,
    },
  };

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

  useEffect(() => {
    if (!provider) {
      getProvider();
    }
  }, [provider]);

  return (
    <Box
      sx={{
        background: '#FFFFFF',
        boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)',
        borderRadius: '18px',
        width: '100%',
        maxWidth: '392px',
        margin: '0 auto',
      }}
    >
      <Box
        sx={{
          padding: '24px 24px 18px',
          background: '#22252A',
          borderTopLeftRadius: '18px',
          borderTopRightRadius: '18px',
          color: '#FFFFFF',
        }}
      >
        <Typography
          sx={{
            fontWeight: '700',
            fontSize: '24px',
            lineHeight: '29px',
          }}
        >
          Provider
        </Typography>
        {provider?.walletAddress ? (
          <TransactionID
            containerStyle={{ marginTop: '5px' }}
            valueStyle={{ color: '#E3E3E8' }}
            iconStyle={{ color: '#F57F21' }}
            value={provider?.walletAddress}
            showCopyButton
            link={providerLink}
          />
        ) : (
          <Skeleton variant="rounded" height="24px" sx={{ marginTop: '5px' }} />
        )}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-start"
          gap="24px"
          sx={{ paddingTop: '18px' }}
        >
          <Box>
            <Tooltip title="Trades: 134">
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-start"
                gap="4px"
              >
                <CurrencyExchangeIcon
                  sx={{
                    fontSize: '14px',
                    color: '#808898',
                  }}
                />
                <Typography
                  sx={{
                    fontWeight: '400',
                    fontSize: '14px',
                    lineHeight: '14px',
                    color: '#E3E3E8',
                  }}
                >
                  134
                </Typography>
              </Stack>
            </Tooltip>
          </Box>
          <Box>
            <Tooltip title="Disputes: 2">
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-start"
                gap="4px"
              >
                <GavelIcon
                  sx={{
                    fontSize: '14px',
                    color: '#808898',
                  }}
                />
                <Typography
                  sx={{
                    fontWeight: '400',
                    fontSize: '14px',
                    lineHeight: '14px',
                    color: '#E3E3E8',
                  }}
                >
                  2
                </Typography>
              </Stack>
            </Tooltip>
          </Box>
          <Box>
            <Tooltip title="Avg. pay time: 120s">
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-start"
                gap="4px"
              >
                <AccessTimeIcon
                  sx={{
                    fontSize: '14px',
                    color: '#808898',
                  }}
                />
                <Typography
                  sx={{
                    fontWeight: '400',
                    fontSize: '14px',
                    lineHeight: '14px',
                    color: '#E3E3E8',
                  }}
                >
                  120s
                </Typography>
              </Stack>
            </Tooltip>
          </Box>
        </Stack>
      </Box>
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
                width: '167px',
                height: '174px',
                minWidth: '167px',
                overflow: 'hidden',
                '& img': {
                  width: '167px',
                  height: '174px',
                  display: 'block',
                },
              }}
            >
              <img src={offer.image} alt="" />
            </Box>
          )}
          <Box>
            {offer.title && (
              <Typography
                sx={{
                  fontWeight: '700',
                  fontSize: '22px',
                  lineHeight: '27px',
                }}
              >
                {offer.title}
              </Typography>
            )}
            {offerChain && offerToken ? (
              <ChainTokenBox
                style={{
                  flex: 1,
                  paddingLeft: '0',
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
                      offerChain.label ? (
                        <Avatar
                          src={offerChain.icon}
                          alt={offerChain.label}
                          sx={{
                            width: '16px',
                            height: '16px',
                            border: '2px solid #fff',
                            background: '#fff',
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
                        alt={offerToken.symbol || offer.token || ''}
                      >
                        {offerToken.symbol || offer.token || ''}
                      </Avatar>
                    ) : (
                      <AvatarDefault width={32} height={32} />
                    )}
                  </Badge>
                }
                title={
                  offer.amount ? (
                    <Box
                      style={{
                        whiteSpace: 'pre-wrap',
                        color: offer.isActive ? '#000' : '#aaa',
                      }}
                      mb={'3px'}
                    >
                      {parseFloat(offer.amount).toLocaleString()}{' '}
                      {offerToken.symbol}
                    </Box>
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
        <Stack>
          <Box>
            {currentFromChain && fromToken ? (
              <ChainTokenBox
                style={{
                  flex: 1,
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
                sx={{ margin: '8px 0 0' }}
              />
            )}
          </Box>
        </Stack>
      </Box>
      <Box
        sx={{
          margin: '16px 24px 0',
          '& > div': {
            margin: '0',
            padding: '0',
          },
          '& button': {
            background: '#F57F21',
            margin: '0',
            '&:hover': {
              background: '#F57F21',
            },
            '& span': {
              marginRight: '0',
            },
          },
        }}
      >
        <DexCardSubmitButton label="Buy now" onClick={() => {}} />
      </Box>
      <Box sx={{ padding: '16px 24px 24px', textAlign: 'center' }}>
        {offer.hash ? (
          <TransactionID
            containerStyle={{ justifyContent: 'center' }}
            valueStyle={{
              color: '#0B0C0E',
            }}
            iconStyle={{
              color: '#9DA2AE',
            }}
            value={offer.hash}
            link={explorerLink}
          />
        ) : (
          <Skeleton />
        )}
      </Box>
    </Box>
  );
};

export default OfferCard;
