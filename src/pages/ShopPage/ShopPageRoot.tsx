import React from 'react';
import { Box } from '@mui/system';
import { Stack, Typography } from '@mui/material';
import ShopPageOfferAccept from './ShopPageOfferAccept';
import { OfferCard, Loading } from '../../components';
import { OfferType, TokenType } from '../../types';
import {
  useAppSelector,
  selectShopAccepting,
  selectShopApproved,
  selectShopLoading,
  selectShopOffers,
  selectChainsItems,
  selectUserAccessToken,
  selectUserAddress,
  selectUserChainId,
  selectPoolAbi,
  selectTokenAbi,
  selectUserChainTokenPrice,
} from '../../store';
import { getChainById } from '../../utils';
import { useShopController } from '../../controllers';

type Props = {};

const ShopPageRoot = (props: Props) => {
  const accessToken = useAppSelector(selectUserAccessToken);
  const userChainId = useAppSelector(selectUserChainId);
  const userAddress = useAppSelector(selectUserAddress);
  const offers = useAppSelector((state) =>
    selectShopOffers(state, userChainId)
  );
  const loading = useAppSelector(selectShopLoading);
  const accepting = useAppSelector(selectShopAccepting);
  const approved = useAppSelector(selectShopApproved);
  const chains = useAppSelector(selectChainsItems);
  const fromChain = getChainById(userChainId, chains);
  const tokenPrice = useAppSelector(selectUserChainTokenPrice);
  const fromToken = fromChain?.tokens?.find(
    (token: TokenType) => token.symbol === fromChain?.nativeToken
  );
  const { handleAcceptOfferAction } = useShopController();
  const tokenAbi = useAppSelector(selectTokenAbi);
  const poolAbi = useAppSelector(selectPoolAbi);

  return accessToken ? (
    <>
      <ShopPageOfferAccept />
      <Box
        sx={{
          marginBottom: '20px',
          marginLeft: { xs: '16px', lg: '24px' },
          marginRight: { xs: '16px', lg: '24px' },
        }}
        flex="1"
        className="ShopPageRoot__box"
      >
        {loading && offers.length < 1 ? (
          <Loading />
        ) : (
          <>
            {offers.length > 0 ? (
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
            ) : (
              <>
                <Typography textAlign="center">Offers not found</Typography>
              </>
            )}
          </>
        )}
      </Box>
    </>
  ) : null;
};

export default ShopPageRoot;
