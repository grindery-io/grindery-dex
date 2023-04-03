import React, { useEffect, useState } from 'react';
import { Box, Skeleton, Stack, Tooltip, Typography } from '@mui/material';
import { Offer } from '../../types/Offer';
import { Chain } from '../../types/Chain';
import { DELIGHT_API_URL } from '../../constants';
import axios from 'axios';
import { useGrinderyNexus } from 'use-grindery-nexus';
import { LiquidityWallet } from '../../types/LiquidityWallet';
import useGrinderyChains from '../../hooks/useGrinderyChains';
import TransactionID from '../TransactionID/TransactionID';
import GavelIcon from '@mui/icons-material/Gavel';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

type Props = {
  offer: Offer;
};

const OfferCardHeader = (props: Props) => {
  const { token: userToken } = useGrinderyNexus();
  const { offer } = props;
  const { chains } = useGrinderyChains();

  const [provider, setProvider] = useState<LiquidityWallet | null>(null);

  const params = {
    headers: {
      Authorization: `Bearer ${userToken?.access_token || ''}`,
    },
  };

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
        padding: '16px 16px 10px',
        background: '#22252A',
        borderTopLeftRadius: '18px',
        borderTopRightRadius: '18px',
        color: '#FFFFFF',
      }}
    >
      <Typography
        sx={{
          fontWeight: '700',
          fontSize: '16px',
          lineHeight: '19px',
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
        sx={{ paddingTop: '10px' }}
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
                  fontSize: '12px',
                  lineHeight: '12px',
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
  );
};

export default OfferCardHeader;
