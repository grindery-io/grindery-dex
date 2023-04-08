import React from 'react';
import { Box } from '@mui/system';
import { Route, Routes, useLocation } from 'react-router-dom';
import TradePageSelectToChainAndToken from './TradePageSelectToChainAndToken';
import TradePageOffersList from './TradePageOffersList';
import TradePageOffersFilter from './TradePageOffersFilter';
import TradePageOfferAccept from './TradePageOfferAccept';
import TradePageHistory from './TradePageHistory';
import TradePageSelectFromChainAndToken from './TradePageSelectFromChainAndToken';
import TradeController from '../../controllers/TradeController';
import { ROUTES } from '../../config/routes';
import { useAppSelector } from '../../store/storeHooks';
import { selectTradeOffersVisible } from '../../store/slices/tradeSlice';

type Props = {};

const TradePage = (props: Props) => {
  let location = useLocation();
  const isOffersVisible = useAppSelector(selectTradeOffersVisible);
  const showRightColumn =
    [
      ROUTES.BUY.TRADE.ROOT.FULL_PATH,
      ROUTES.BUY.TRADE.SELECT_FROM.FULL_PATH,
      ROUTES.BUY.TRADE.SELECT_TO.FULL_PATH,
    ].includes(location.pathname) && isOffersVisible;

  return (
    <TradeController>
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
              path={ROUTES.BUY.TRADE.SELECT_FROM.RELATIVE_PATH}
              element={<TradePageSelectFromChainAndToken />}
            />
            <Route
              path={ROUTES.BUY.TRADE.SELECT_TO.RELATIVE_PATH}
              element={<TradePageSelectToChainAndToken />}
            />
            <Route
              path={ROUTES.BUY.TRADE.ACCEPT_OFFER.RELATIVE_PATH}
              element={<TradePageOfferAccept />}
            />
            <Route
              path={ROUTES.BUY.TRADE.HISTORY.RELATIVE_PATH}
              element={<TradePageHistory />}
            />
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
        >
          <TradePageOffersList />
        </Box>
      </Box>
    </TradeController>
  );
};

export default TradePage;
