import React, { useCallback } from 'react';
import { Box } from '@mui/system';
import { Route, Routes, useLocation } from 'react-router-dom';
import TradePageSelectToChainAndToken from './TradePageSelectToChainAndToken';
import TradePageOffersList from './TradePageOffersList';
import TradePageOffersFilter from './TradePageOffersFilter';
import { TradeProvider, useTradeProvider } from '../../providers';
import { ROUTES } from '../../config';
import {
  useAppSelector,
  useAppDispatch,
  selectOrdersStore,
  selectChainsStore,
  selectTradeStore,
  tradeStoreActions,
  selectUserStore,
} from '../../store';
import Page404 from '../Page404/Page404';
import { OrderType } from '../../types';
import { OrderPlacingModal } from '../../components';

type Props = {};

const TradePage = (props: Props) => {
  let location = useLocation();
  const dispatch = useAppDispatch();
  const {
    isOffersVisible,
    modal: showModal,
    orderStatus,
    orderTransactionId,
    error: errorMessage,
  } = useAppSelector(selectTradeStore);
  const showRightColumn =
    [
      ROUTES.BUY.TRADE.ROOT.FULL_PATH,
      ROUTES.BUY.TRADE.SELECT_TO.FULL_PATH,
    ].includes(location.pathname) && isOffersVisible;
  const { items: chains } = useAppSelector(selectChainsStore);
  const { items: orders } = useAppSelector(selectOrdersStore);
  const createdOrder =
    (orderTransactionId &&
      orders.find((order: OrderType) => order.hash === orderTransactionId)) ||
    undefined;
  const { address: userWalletAddress } = useAppSelector(selectUserStore);
  const { handleEmailSubmitAction } = useTradeProvider();

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
    dispatch(tradeStoreActions.setOfferId(''));
    dispatch(tradeStoreActions.setOrderTransactionId(''));
    dispatch(tradeStoreActions.setModal(false));
  };

  return (
    <TradeProvider>
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
    </TradeProvider>
  );
};

export default TradePage;
