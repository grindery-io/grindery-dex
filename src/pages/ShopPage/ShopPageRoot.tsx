import React, { useCallback, useState } from 'react';
import { Box } from '@mui/system';
import { Stack, Typography } from '@mui/material';
import {
  OfferCard,
  Loading,
  OrderPlacingModal,
  ConnectWalletModal,
} from '../../components';
import { OfferType, OrderType, TokenType } from '../../types';
import {
  useAppSelector,
  selectShopLoading,
  selectShopOffers,
  selectChainsItems,
  selectUserAccessToken,
  selectUserAddress,
  selectUserChainId,
  selectPoolAbi,
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
} from '../../store';
import { getChainById } from '../../utils';
import { useShopController, useUserController } from '../../controllers';

type Props = {};

const ShopPageRoot = (props: Props) => {
  const dispatch = useAppDispatch();
  const { connectUser } = useUserController();
  const accessToken = useAppSelector(selectUserAccessToken);
  const userChainId = useAppSelector(selectUserChainId);
  const userAddress = useAppSelector(selectUserAddress);
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
  const poolAbi = useAppSelector(selectPoolAbi);
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
  const { handleEmailSubmitAction } = useShopController();

  const onEmailSubmit = useCallback(
    async (email: string): Promise<boolean> => {
      if (!createdOrder) {
        return false;
      }
      const res = await handleEmailSubmitAction(
        accessToken,
        email,
        createdOrder.orderId,
        userWalletAddress
      );
      return res;
    },
    [handleEmailSubmitAction, accessToken, createdOrder, userWalletAddress]
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
                        accepting={offerId}
                        advancedMode={advancedMode}
                        onAcceptOfferClick={(offer: OfferType) => {
                          if (!accessToken) {
                            setShowWalletModal(true);
                          } else {
                            handleAcceptOfferAction(
                              offer,
                              accessToken,
                              userChainId,
                              fromToken,
                              poolAbi,
                              userAddress,
                              chains
                            );
                          }
                        }}
                      />
                    ))}
                  </Stack>
                ) : null}
              </>
            ) : (
              <>
                <Typography textAlign="center">No offers found</Typography>
              </>
            )}
          </>
        )}
      </Box>
    </>
  );
};

export default ShopPageRoot;
