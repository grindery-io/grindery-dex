import React from 'react';
import { Box } from '@mui/system';
import useShopPage from '../../hooks/useShopPage';
import OfferCard from '../../components/OfferCard/OfferCard';
import { Stack } from '@mui/material';
import ShopPageOfferAccept from './ShopPageOfferAccept';
import Offer from '../../models/Offer';

type Props = {};

const ShopPageRoot = (props: Props) => {
  const { foundOffers } = useShopPage();

  return (
    <>
      <ShopPageOfferAccept />
      <Box
        sx={{
          marginBottom: '20px',
          marginLeft: { xs: '16px', lg: '24px' },
          marginRight: { xs: '16px', lg: '24px' },
        }}
        flex="1"
      >
        <Stack
          flexWrap="wrap"
          alignItems="stretch"
          direction="row"
          gap="24px"
          sx={{
            width: '100%',
            maxWidth: '1053px',
            margin: '0 auto',
            justifyContent: { xs: 'center', lg: 'flex-start' },
          }}
        >
          {foundOffers.map((offer: Offer) => (
            <OfferCard key={offer._id} offer={offer} />
          ))}
        </Stack>
      </Box>
    </>
  );
};

export default ShopPageRoot;
