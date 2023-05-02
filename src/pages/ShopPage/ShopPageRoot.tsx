import React, { useCallback, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Box } from '@mui/system';
import { Stack, Typography } from '@mui/material';
import {
  OfferCard,
  OrderPlacingModal,
  ConnectWalletModal,
  OfferCardSkeleton,
} from '../../components';
import { OfferType, OrderType, TokenType } from '../../types';
import {
  useAppSelector,
  selectShopLoading,
  selectShopOffers,
  selectChainsItems,
  selectUserAccessToken,
  selectUserAddress,
  selectUserChainTokenPrice,
  selectUserAdvancedMode,
  selectShopOfferId,
  selectShopModal,
  selectShopError,
  selectShopOrderTransactionId,
  selectOrdersItems,
  selectShopOrderStatus,
  useAppDispatch,
  setShopOfferId,
  setShopOrderTransactionId,
  setShopModal,
  selectShopOffersHasMore,
} from '../../store';
import { getChainById } from '../../utils';
import { useShopController, useUserController } from '../../controllers';

type Props = {};

const ShopPageRoot = (props: Props) => {
  const dispatch = useAppDispatch();
  const { connectUser } = useUserController();
  const accessToken = useAppSelector(selectUserAccessToken);
  const offers = useAppSelector(selectShopOffers);
  const loading = useAppSelector(selectShopLoading);
  const offerId = useAppSelector(selectShopOfferId);
  const chains = useAppSelector(selectChainsItems);
  const fromChain = getChainById('5', chains);
  const tokenPrice = useAppSelector(selectUserChainTokenPrice);
  const fromToken = fromChain?.tokens?.find(
    (token: TokenType) => token.symbol === fromChain?.nativeToken
  );
  const { handleAcceptOfferAction } = useShopController();
  const advancedMode = useAppSelector(selectUserAdvancedMode);
  const [showWalletModal, setShowWalletModal] = useState(false);

  const userWalletAddress = useAppSelector(selectUserAddress);
  const showModal = useAppSelector(selectShopModal);
  const errorMessage = useAppSelector(selectShopError);
  const orderTransactionId = useAppSelector(selectShopOrderTransactionId);
  const orders = useAppSelector(selectOrdersItems);
  const orderStatus = useAppSelector(selectShopOrderStatus);
  const createdOrder =
    (orderTransactionId &&
      orders.find((order: OrderType) => order.hash === orderTransactionId)) ||
    undefined;
  const { handleEmailSubmitAction, handleFetchMoreOffersAction } =
    useShopController();
  const hasMore = useAppSelector(selectShopOffersHasMore);

  const onEmailSubmit = useCallback(
    async (email: string): Promise<boolean> => {
      if (!createdOrder) {
        return false;
      }
      const res = await handleEmailSubmitAction(
        email,
        createdOrder.orderId,
        userWalletAddress
      );
      return res;
    },
    [handleEmailSubmitAction, createdOrder, userWalletAddress]
  );

  const onModalClose = () => {
    dispatch(setShopOfferId(''));
    dispatch(setShopOrderTransactionId(''));
    dispatch(setShopModal(false));
  };

  return (
    <>
      {!accessToken && (
        <ConnectWalletModal
          open={showWalletModal}
          onClose={() => {
            setShowWalletModal(false);
          }}
          onConnect={() => {
            connectUser();
          }}
        />
      )}
      <OrderPlacingModal
        open={showModal}
        chains={chains}
        orderStatus={orderStatus}
        createdOrder={createdOrder}
        errorMessage={errorMessage}
        onEmailSubmit={onEmailSubmit}
        onClose={onModalClose}
      />
      <Box
        sx={{
          marginBottom: '20px',
          marginLeft: { xs: '16px', lg: '24px' },
          marginRight: { xs: '16px', lg: '24px' },
        }}
        flex="1"
        className="ShopPageRoot__box"
      >
        {!loading && offers.length < 1 && (
          <Typography textAlign="center">No offers found</Typography>
        )}
        {loading || !fromChain || !fromToken ? (
          <Stack
            flexWrap="wrap"
            alignItems="stretch"
            direction="row"
            gap="24px"
            sx={{
              width: '100%',
              maxWidth: '1053px',
              margin: '24px auto 0',
              justifyContent: { xs: 'center', lg: 'flex-start' },
            }}
          >
            {[0, 1, 2].map((i: number) => (
              <OfferCardSkeleton key={i} />
            ))}
          </Stack>
        ) : (
          <InfiniteScroll
            dataLength={offers.length}
            next={handleFetchMoreOffersAction}
            hasMore={hasMore}
            loader={
              <Stack
                flexWrap="wrap"
                alignItems="stretch"
                direction="row"
                gap="24px"
                sx={{
                  width: '100%',
                  maxWidth: '1053px',
                  margin: '24px auto 0',
                  justifyContent: { xs: 'center', lg: 'flex-start' },
                }}
              >
                {[0, 1, 2].map((i: number) => (
                  <OfferCardSkeleton key={i} />
                ))}
              </Stack>
            }
            style={{ paddingBottom: '30px' }}
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
              {offers.map((offer: OfferType) => (
                <OfferCard
                  id={offer.offerId || offer._id}
                  key={offer._id}
                  offer={offer}
                  tokenPrice={tokenPrice}
                  fromChain={fromChain}
                  fromToken={fromToken}
                  chains={chains}
                  accepting={offerId}
                  advancedMode={advancedMode}
                  onAcceptOfferClick={(offer: OfferType) => {
                    if (!accessToken) {
                      setShowWalletModal(true);
                    } else {
                      handleAcceptOfferAction(offer);
                    }
                  }}
                />
              ))}
            </Stack>
          </InfiniteScroll>
        )}
      </Box>
    </>
  );
};

export default ShopPageRoot;
