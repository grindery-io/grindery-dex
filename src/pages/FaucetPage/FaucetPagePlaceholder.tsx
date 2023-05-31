import React from 'react';
import { Box, Typography } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Icon from '@mdi/react';
import { mdiWaterPump } from '@mdi/js';
import { PageCardBody, PageCardHeader } from '../../components';

function FaucetPagePlaceholder() {
  return (
    <>
      <PageCardHeader title="Faucet" titleAlign="center" />
      <PageCardBody>
        <Box sx={{ textAlign: 'center' }}>
          <Icon
            path={mdiWaterPump}
            style={{ width: '40px', height: '40px', marginBottom: '16px' }}
          />
          <Typography className="Faucet_text" sx={{ marginBottom: '20px' }}>
            Visit{' '}
            <a
              style={{ color: '#3f49e1' }}
              href="https://testnet.bnbchain.org/faucet-smart"
              target="_blank"
              rel="noreferrer"
              id="faucet-link"
            >
              <strong>testnet.bnbchain.org</strong>
              <OpenInNewIcon
                sx={{
                  display: 'inline-block',
                  marginBottom: '-4px',
                  fontSize: '16px',
                }}
              />
            </a>
            <br />
            to get some BSC testnet BNB tokens.
          </Typography>
          <Typography className="Faucet_text" sx={{ marginBottom: '20px' }}>
            Visit{' '}
            <a
              style={{ color: '#3f49e1' }}
              href="https://mumbaifaucet.com/"
              target="_blank"
              rel="noreferrer"
              id="faucet-link"
            >
              <strong>mumbaifaucet.com</strong>
              <OpenInNewIcon
                sx={{
                  display: 'inline-block',
                  marginBottom: '-4px',
                  fontSize: '16px',
                }}
              />
            </a>
            <br />
            to get some Mumbai testnet MATIC tokens.
          </Typography>
          <Typography className="Faucet_text">
            Visit{' '}
            <a
              style={{ color: '#3f49e1' }}
              href="https://faucet.fantom.network/"
              target="_blank"
              rel="noreferrer"
              id="faucet-link"
            >
              <strong>faucet.fantom.network</strong>
              <OpenInNewIcon
                sx={{
                  display: 'inline-block',
                  marginBottom: '-4px',
                  fontSize: '16px',
                }}
              />
            </a>
            <br />
            to get some Fantom testnet FTM tokens.
          </Typography>
        </Box>

        <Box height="36px"></Box>
      </PageCardBody>
    </>
  );
}

export default FaucetPagePlaceholder;
