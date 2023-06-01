import React, { useCallback, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Box } from '@mui/system';
import { Stack, Typography } from '@mui/material';
import {
  OfferCard,
  ConnectWalletModal,
  OfferCardSkeleton,
  ShopFilters,
  OrderPlacingModalV2,
} from '../../components';
import { OfferType, OrderType, TokenType } from '../../types';
import {
  useAppSelector,
  useAppDispatch,
  selectShopStore,
  shopStoreActions,
  selectChainsStore,
  selectUserStore,
  selectOrdersHistoryStore,
} from '../../store';
import { getChainById, getTokensOptionsList } from '../../utils';
import { useShopProvider, useUserProvider } from '../../providers';

type Props = {};

const ShopPageRoot = (props: Props) => {
  const dispatch = useAppDispatch();
  const { connectUser, getTokenPriceBySymbol } = useUserProvider();
  const {
    accessToken,
    address: userWalletAddress,
    advancedMode,
  } = useAppSelector(selectUserStore);
  const {
    offers,
    loading,
    offerId,
    modal: showModal,
    error: errorMessage,
    orderTransactionId,
    orderStatus,
    total,
    filter,
  } = useAppSelector(selectShopStore);
  const { items: chains } = useAppSelector(selectChainsStore);
  const fromChain = getChainById('4002', chains);
  const fromToken = fromChain?.tokens?.find(
    (token: TokenType) => token.symbol === fromChain?.nativeToken
  );
  const { handleAcceptOfferAction } = useShopProvider();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const { items: orders } = useAppSelector(selectOrdersHistoryStore);
  const createdOrder =
    (orderTransactionId &&
      orders.find((order: OrderType) => order.hash === orderTransactionId)) ||
    undefined;
  const { handleEmailSubmitAction, handleFetchMoreOffersAction } =
    useShopProvider();
  const hasMore = offers.length < total;
  const filterOptions = getTokensOptionsList(chains);
  const acceptingOffer = offers.find((offer) => offer.offerId === offerId);

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
    dispatch(shopStoreActions.setOfferId(''));
    dispatch(shopStoreActions.setOrderTransactionId(''));
    dispatch(shopStoreActions.setModal(false));
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
      <OrderPlacingModalV2
        open={showModal}
        chains={chains}
        orderStatus={orderStatus}
        createdOrder={createdOrder}
        errorMessage={errorMessage}
        onEmailSubmit={onEmailSubmit}
        onClose={onModalClose}
        offer={acceptingOffer}
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
        <ShopFilters
          filter={filter}
          filterOptions={filterOptions}
          onChange={(newFilter) => {
            dispatch(shopStoreActions.setFilter(newFilter));
          }}
        />
        {!loading && offers.length < 1 && (
          <Typography textAlign="center">No offers found</Typography>
        )}
        {loading ? (
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
          <>
            {offers.length > 0 && fromChain && fromToken && (
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
                      getTokenPrice={getTokenPriceBySymbol}
                    />
                  ))}
                </Stack>
              </InfiniteScroll>
            )}
          </>
        )}
      </Box>
    </>
  );
};

export default ShopPageRoot;
