import React from 'react';
import { Box } from '@mui/system';
import useShopPage from '../../hooks/useShopPage';
import { Offer } from '../../types/Offer';
import OfferCard from '../../components/OfferCard/OfferCard';
import { Stack } from '@mui/material';
import useGrinderyChains from '../../hooks/useGrinderyChains';
import ShopPageOfferAccept from './ShopPageOfferAccept';

type Props = {};

const ShopPageRoot = (props: Props) => {
  const { foundOffers } = useShopPage();
  const { chains } = useGrinderyChains();

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
            maxWidth: '1174px',
            margin: '0 auto',
            justifyContent: { xs: 'center', lg: 'flex-start' },
          }}
        >
          {foundOffers.map((offer: Offer) => {
            const offerChain = chains.find(
              (c) => c.value === `eip155:${offer.chainId}`
            );
            const offerToken = offerChain?.tokens?.find(
              (t) => t.coinmarketcapId === offer.tokenId
            );
            return (
              <OfferCard
                key={offer._id}
                offer={offer}
                offerChain={offerChain}
                offerToken={offerToken}
              />
            );
          })}
        </Stack>
      </Box>
    </>
  );
};

export default ShopPageRoot;
