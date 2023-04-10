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
          <Typography>
            Visit{' '}
            <a
              style={{ color: '#3f49e1' }}
              href="https://goerlifaucet.com/"
              target="_blank"
              rel="noreferrer"
            >
              <strong>goerlifaucet.com</strong>
              <OpenInNewIcon
                sx={{
                  display: 'inline-block',
                  marginBottom: '-4px',
                  fontSize: '16px',
                }}
              />
            </a>
            <br />
            to get some Goerli-ETH tokens.
          </Typography>
        </Box>

        <Box height="36px"></Box>
      </PageCardBody>
    </>
  );
}

export default FaucetPagePlaceholder;
