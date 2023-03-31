import React, { useEffect } from 'react';
import { Box } from '@mui/system';
import { Route, Routes } from 'react-router-dom';
import ShopPageOfferAccept from './ShopPageOfferAccept';
import ShopPageRoot from './ShopPageRoot';
import useShopPage from '../../hooks/useShopPage';
import useOffers from '../../hooks/useOffers';
import { useGrinderyNexus } from 'use-grindery-nexus';

type Props = {};

const ShopPage = (props: Props) => {
  const { token } = useGrinderyNexus();
  const { VIEWS } = useShopPage();
  const { getAllOffers } = useOffers();

  useEffect(() => {
    if (token?.access_token) {
      getAllOffers();
    }
  }, [token?.access_token]);

  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="center"
      flexWrap="wrap"
    >
      <Routes>
        <Route path={VIEWS.ROOT.path} element={<ShopPageRoot />} />
        <Route
          path={VIEWS.ACCEPT_OFFER.path}
          element={
            <Box width="375px" mb="20px">
              <ShopPageOfferAccept />
            </Box>
          }
        />
      </Routes>
    </Box>
  );
};

export default ShopPage;
