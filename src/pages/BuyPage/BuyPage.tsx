import React from 'react';
import { Box } from '@mui/system';
import { Route, Routes, useLocation } from 'react-router-dom';
import PageContainer from '../../components/PageContainer/PageContainer';
import useBuyPage from '../../hooks/useBuyPage';
import BuyPageSelectToChainAndToken from './BuyPageSelectToChainAndToken';
import BuyPageOffersList from './BuyPageOffersList';
import BuyPageOffersFilter from './BuyPageOffersFilter';
import BuyPageOfferAccept from './BuyPageOfferAccept';
import BuyPageHistory from './BuyPageHistory';
import BuyPageSelectFromChainAndToken from './BuyPageSelectFromChainAndToken';

type Props = {};

const BuyPage = (props: Props) => {
  const { VIEWS, isOffersVisible } = useBuyPage();

  let location = useLocation();

  const showRightColumn =
    [
      VIEWS.ROOT.fullPath,
      VIEWS.SELECT_FROM.fullPath,
      VIEWS.SELECT_TO.fullPath,
    ].includes(location.pathname) && isOffersVisible;

  return (
    <div>
      <PageContainer>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="center"
          flexWrap="wrap"
          gap="20px"
        >
          <Box width="375px">
            <Routes>
              <Route path={VIEWS.ROOT.path} element={<BuyPageOffersFilter />} />
              <Route
                path={VIEWS.SELECT_FROM.path}
                element={<BuyPageSelectFromChainAndToken />}
              />
              <Route
                path={VIEWS.SELECT_TO.path}
                element={<BuyPageSelectToChainAndToken />}
              />
              <Route
                path={VIEWS.ACCEPT_OFFER.path}
                element={<BuyPageOfferAccept />}
              />
              <Route path={VIEWS.HISTORY.path} element={<BuyPageHistory />} />
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
            <BuyPageOffersList />
          </Box>
        </Box>
      </PageContainer>
    </div>
  );
};

export default BuyPage;
