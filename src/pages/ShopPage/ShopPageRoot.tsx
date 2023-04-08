import React from 'react';
import { Box } from '@mui/system';
import OfferCard from '../../components/OfferCard/OfferCard';
import { Stack } from '@mui/material';
import ShopPageOfferAccept from './ShopPageOfferAccept';
import { OfferType } from '../../types/OfferType';
import { useAppSelector } from '../../store/storeHooks';
import {
  selectShopAccepting,
  selectShopApproved,
  selectShopFilter,
  selectShopFromTokenPrice,
  selectShopLoading,
  selectShopOffers,
} from '../../store/slices/shopSlice';
import Loading from '../../components/Loading/Loading';
import { selectChainsItems } from '../../store/slices/chainsSlice';
import { getChainById } from '../../utils/helpers/chainHelpers';
import {
  getTokenById,
  getTokenBySymbol,
} from '../../utils/helpers/tokenHelpers';
import { useShopController } from '../../controllers/ShopController';
import {
  selectUserAccessToken,
  selectUserAddress,
  selectUserChainId,
} from '../../store/slices/userSlice';
import { selectPoolAbi, selectTokenAbi } from '../../store/slices/abiSlice';

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
