import React, { useCallback } from 'react';
import { Box } from '@mui/system';
import { Route, Routes, useLocation } from 'react-router-dom';
import TradePageSelectToChainAndToken from './TradePageSelectToChainAndToken';
import TradePageOffersList from './TradePageOffersList';
import TradePageOffersFilter from './TradePageOffersFilter';
import { TradeController, useTradeController } from '../../controllers';
import { ROUTES } from '../../config';
import {
  useAppSelector,
  selectTradeOffersVisible,
  selectTradeModal,
  selectChainsItems,
  selectTradeOrderStatus,
  selectTradeOrderTransactionId,
  selectOrdersItems,
  selectTradeError,
  selectUserAddress,
  selectUserAccessToken,
  useAppDispatch,
  setTradeOfferId,
  setTradeOrderTransactionId,
  setTradeModal,
} from '../../store';
import Page404 from '../Page404/Page404';
import { OrderType } from '../../types';
import { OrderPlacingModal } from '../../components';

type Props = {};

const TradePage = (props: Props) => {
  let location = useLocation();
  const dispatch = useAppDispatch();
  const isOffersVisible = useAppSelector(selectTradeOffersVisible);
  const showRightColumn =
    [
      ROUTES.BUY.TRADE.ROOT.FULL_PATH,
      ROUTES.BUY.TRADE.SELECT_TO.FULL_PATH,
    ].includes(location.pathname) && isOffersVisible;
  const showModal = useAppSelector(selectTradeModal);
  const chains = useAppSelector(selectChainsItems);
  const orderStatus = useAppSelector(selectTradeOrderStatus);
  const orderTransactionId = useAppSelector(selectTradeOrderTransactionId);
  const orders = useAppSelector(selectOrdersItems);
  const createdOrder =
    (orderTransactionId &&
      orders.find((order: OrderType) => order.hash === orderTransactionId)) ||
    undefined;
  const errorMessage = useAppSelector(selectTradeError);
  const userWalletAddress = useAppSelector(selectUserAddress);
  const accessToken = useAppSelector(selectUserAccessToken);
  const { handleEmailSubmitAction } = useTradeController();

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
    dispatch(setTradeOfferId(''));
    dispatch(setTradeOrderTransactionId(''));
    dispatch(setTradeModal(false));
  };

  return (
    <TradeController>
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
        display="flex"
        flexDirection="row"
        justifyContent="center"
        flexWrap="wrap"
      >
        <Box width="375px" mb="20px">
          <Routes>
            <Route
              path={ROUTES.BUY.TRADE.ROOT.RELATIVE_PATH}
              element={<TradePageOffersFilter />}
            />
            <Route
              path={ROUTES.BUY.TRADE.SELECT_TO.RELATIVE_PATH}
              element={<TradePageSelectToChainAndToken />}
            />
            <Route path="*" element={<Page404 />} />
          </Routes>
        </Box>

        <Box
          sx={{
            width: showRightColumn ? '375px' : '0px',
            transformOrigin: 'left top',
            transform: showRightColumn
              ? 'scaleX(1) scaleY(1)'
              : 'scaleX(0) scaleY(0)',
            opacity: showRightColumn ? '1' : '0',
            transition: 'all 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
            marginLeft: showRightColumn ? '20px' : 0,
          }}
          className="TradePage__box"
        >
          <TradePageOffersList />
        </Box>
      </Box>
    </TradeController>
  );
};

export default TradePage;
