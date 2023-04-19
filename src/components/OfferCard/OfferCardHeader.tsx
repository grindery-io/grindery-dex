import React from 'react';
import { Box, Skeleton, Stack, Tooltip, Typography } from '@mui/material';
import TransactionID from '../TransactionID/TransactionID';
import GavelIcon from '@mui/icons-material/Gavel';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { getOfferProviderLink } from '../../utils';
import { OfferCardProps } from './OfferCard';

const OfferCardHeader = (props: OfferCardProps) => {
  const { offer, chains, advancedMode } = props;
  const provider = offer.provider;
  const providerLink = getOfferProviderLink(offer, chains);
  const isInAdvancedMode = advancedMode !== undefined ? advancedMode : true;

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
        {offer.providerDetails?.name || 'Offer'}
      </Typography>
      {isInAdvancedMode && (
        <>
          {provider ? (
            <TransactionID
              containerStyle={{ marginTop: '5px' }}
              valueStyle={{ color: '#E3E3E8' }}
              iconStyle={{ color: '#F57F21' }}
              value={provider}
              showCopyButton
              link={providerLink}
            />
          ) : (
            <Skeleton
              variant="rounded"
              height="24px"
              sx={{ marginTop: '5px' }}
            />
          )}
        </>
      )}

      {isInAdvancedMode && (
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
      )}
    </Box>
  );
};

export default OfferCardHeader;
