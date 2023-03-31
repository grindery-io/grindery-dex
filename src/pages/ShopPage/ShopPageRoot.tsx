import React from 'react';
import { Box } from '@mui/system';
import useShopPage from '../../hooks/useShopPage';
import { Offer } from '../../types/Offer';
import OfferCard from '../../components/Offer/OfferCard';
import { Grid, Stack } from '@mui/material';
import useGrinderyChains from '../../hooks/useGrinderyChains';

type Props = {};

const ShopPageRoot = (props: Props) => {
  const { foundOffers } = useShopPage();
  const { chains } = useGrinderyChains();

  return (
    <Box
      sx={{
        marginBottom: '20px',
        marginLeft: { xs: '16px', lg: '264px' },
        marginRight: { xs: '16px', lg: '24px' },
      }}
      flex="1"
      gap="16px"
    >
      <Grid
        container
        direction="row"
        alignItems="stretch"
        flexWrap="wrap"
        spacing="24px"
        sx={
          {
            //justifyContent: { xs: 'center', lg: 'flex-start' },
            //gap: { xs: '16px', lg: '24px' },
          }
        }
      >
        {foundOffers.map((offer: Offer) => {
          const offerChain = chains.find(
            (c) => c.value === `eip155:${offer.chainId}`
          );
          const offerToken = offerChain?.tokens?.find(
            (t) => t.coinmarketcapId === offer.tokenId
          );
          return (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={4}
              xl={3}
              sx={{
                '& > .MuiBox-root': {
                  maxWidth: '100%',
                  height: '100%',
                },
              }}
            >
              <OfferCard
                key={offer._id}
                offer={offer}
                offerChain={offerChain}
                offerToken={offerToken}
              />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default ShopPageRoot;
