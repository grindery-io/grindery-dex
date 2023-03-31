import React from 'react';
import { Box } from '@mui/system';
import { Route, Routes, useLocation } from 'react-router-dom';
import PageContainer from '../../components/PageContainer/PageContainer';
import useTradePage from '../../hooks/useTradePage';
import TradePageSelectToChainAndToken from './TradePageSelectToChainAndToken';
import TradePageOffersList from './TradePageOffersList';
import TradePageOffersFilter from './TradePageOffersFilter';
import TradePageOfferAccept from './TradePageOfferAccept';
import TradePageHistory from './TradePageHistory';
import TradePageSelectFromChainAndToken from './TradePageSelectFromChainAndToken';

type Props = {};

const TradePage = (props: Props) => {
  const { VIEWS, isOffersVisible } = useTradePage();

  let location = useLocation();

  const showRightColumn =
    [
      VIEWS.ROOT.fullPath,
      VIEWS.SELECT_FROM.fullPath,
      VIEWS.SELECT_TO.fullPath,
    ].includes(location.pathname) && isOffersVisible;

  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="center"
      flexWrap="wrap"
      gap="20px"
    >
      <Box width="375px">
        <Routes>
          <Route path={VIEWS.ROOT.path} element={<TradePageOffersFilter />} />
          <Route
            path={VIEWS.SELECT_FROM.path}
            element={<TradePageSelectFromChainAndToken />}
          />
          <Route
            path={VIEWS.SELECT_TO.path}
            element={<TradePageSelectToChainAndToken />}
          />
          <Route
            path={VIEWS.ACCEPT_OFFER.path}
            element={<TradePageOfferAccept />}
          />
          <Route path={VIEWS.HISTORY.path} element={<TradePageHistory />} />
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
        }}
      >
        <TradePageOffersList />
      </Box>
    </Box>
  );
};

export default TradePage;
