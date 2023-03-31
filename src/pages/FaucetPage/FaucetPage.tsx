import React from 'react';
import DexCard from '../../components/DexCard/DexCard';
import { Navigate } from 'react-router-dom';
//import useFaucetPage from '../../hooks/useFaucetPage';
//import FaucetPageRoot from './FaucetPageRoot';
//import FaucetPageSelectChain from './FaucetPageSelectChain';
import FaucetMenu from '../../components/FaucetMenu/FaucetMenu';
import useAdmin from '../../hooks/useAdmin';
import Loading from '../../components/Loading/Loading';
import DexCardBody from '../../components/DexCard/DexCardBody';
import { Box, Typography } from '@mui/material';
import DexCardHeader from '../../components/DexCard/DexCardHeader';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Icon from '@mdi/react';
import { mdiWaterPump } from '@mdi/js';

function FaucetPage() {
  //const { VIEWS } = useFaucetPage();
  const { isLoading, isAdmin } = useAdmin();
  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <FaucetMenu />
      <DexCard>
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
        {/*<Routes>
          <Route path={VIEWS.ROOT.path} element={<FaucetPageRoot />} />
          <Route
            path={VIEWS.SELECT_CHAIN.path}
            element={<FaucetPageSelectChain />}
          />
  </Routes>*/}
      </DexCard>
    </>
  );
}

export default FaucetPage;
