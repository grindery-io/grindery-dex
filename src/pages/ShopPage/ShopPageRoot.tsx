import React from 'react';
import { Box } from '@mui/system';
import { Stack } from '@mui/material';
import ShopPageOfferAccept from './ShopPageOfferAccept';
import { OfferCard, Loading } from '../../components';
import { OfferType } from '../../types';
import {
  useAppSelector,
  selectShopAccepting,
  selectShopApproved,
  selectShopFilter,
  selectShopFromTokenPrice,
  selectShopLoading,
  selectShopOffers,
  selectChainsItems,
  selectUserAccessToken,
  selectUserAddress,
  selectUserChainId,
  selectPoolAbi,
  selectTokenAbi,
} from '../../store';
import { getChainById, getTokenById } from '../../utils';
import { useShopController } from '../../controllers';

type Props = {};

const ShopPageRoot = (props: Props) => {
  const accessToken = useAppSelector(selectUserAccessToken);
  const userChainId = useAppSelector(selectUserChainId);
  const userAddress = useAppSelector(selectUserAddress);
  const offers = useAppSelector(selectShopOffers);
  const loading = useAppSelector(selectShopLoading);
  const filter = useAppSelector(selectShopFilter);
  const accepting = useAppSelector(selectShopAccepting);
  const approved = useAppSelector(selectShopApproved);
  const { fromChainId, fromTokenId } = filter;
  const tokenPrice = useAppSelector(selectShopFromTokenPrice);
  const chains = useAppSelector(selectChainsItems);
  const fromChain = getChainById(fromChainId, chains);
  const fromToken = getTokenById(fromTokenId, fromChainId, chains);
  const { handleAcceptOfferAction } = useShopController();
  const tokenAbi = useAppSelector(selectTokenAbi);
  const poolAbi = useAppSelector(selectPoolAbi);

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
        className="shop-offers-list"
      >
        {loading && offers.length < 1 ? (
          <Loading />
        ) : (
          <>
            {fromChain && fromToken ? (
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
                {offers.map((offer: OfferType) => (
                  <OfferCard
                    id={offer.offerId}
                    key={offer._id}
                    offer={offer}
                    tokenPrice={tokenPrice}
                    fromChain={fromChain}
                    fromToken={fromToken}
                    chains={chains}
                    accepting={accepting}
                    onAcceptOfferClick={(offer: OfferType) => {
                      handleAcceptOfferAction(
                        offer,
                        accessToken,
                        userChainId,
                        approved,
                        fromToken,
                        tokenAbi,
                        poolAbi,
                        userAddress
                      );
                    }}
                  />
                ))}
              </Stack>
            ) : null}
          </>
        )}
      </Box>
    </>
  );
};

export default ShopPageRoot;
