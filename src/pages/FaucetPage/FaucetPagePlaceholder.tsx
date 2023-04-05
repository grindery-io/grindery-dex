import React from 'react';
import useAdmin from '../../hooks/useAdmin';
import Loading from '../../components/Loading/Loading';
import DexCardBody from '../../components/DexCard/DexCardBody';
import { Box, Typography } from '@mui/material';
import DexCardHeader from '../../components/DexCard/DexCardHeader';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Icon from '@mdi/react';
import { mdiWaterPump } from '@mdi/js';

function FaucetPagePlaceholder() {
  const { isLoading } = useAdmin();
  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <DexCardHeader title="Faucet" titleAlign="center" />
      <DexCardBody>
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
      </DexCardBody>
    </>
  );
}

export default FaucetPagePlaceholder;
