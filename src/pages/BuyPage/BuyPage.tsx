import React from 'react';
import { Box } from '@mui/system';
import { Route, Routes } from 'react-router-dom';
import DexPageContainer from '../../components/grindery/DexPageContainer/DexPageContainer';
import useBuyPage from '../../hooks/useBuyPage';
import BuyPageSelectToChainAndToken from './BuyPageSelectToChainAndToken';
import BuyPageSelectFromChain from './BuyPageSelectFromChain';
import BuyPageOffersList from './BuyPageOffersList';
import BuyPageOffersFilter from './BuyPageOffersFilter';
import BuyPageOfferAccept from './BuyPageOfferAccept';

type Props = {};

const BuyPage = (props: Props) => {
  const { VIEWS, isOffersVisible } = useBuyPage();
  return (
    <div>
      <DexPageContainer>
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
                path={VIEWS.SELECT_FROM_CHAIN.path}
                element={<BuyPageSelectFromChain />}
              />
              <Route
                path={VIEWS.SELECT_TO_CHAIN_TOKEN.path}
                element={<BuyPageSelectToChainAndToken />}
              />
              <Route
                path={VIEWS.ACCEPT_OFFER.path}
                element={<BuyPageOfferAccept />}
              />
            </Routes>
          </Box>

          <Routes>
            {[
              VIEWS.ROOT.path,
              VIEWS.SELECT_FROM_CHAIN.path,
              VIEWS.SELECT_TO_CHAIN_TOKEN.path,
            ].map((path: string) => (
              <Route
                key={path}
                path={path}
                element={
                  <Box
                    sx={{
                      width: isOffersVisible ? '375px' : '0px',
                      transformOrigin: 'left top',
                      transform: isOffersVisible
                        ? 'scaleX(1) scaleY(1)'
                        : 'scaleX(0) scaleY(0)',
                      opacity: isOffersVisible ? '1' : '0',
                      transition: 'all 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                    }}
                  >
                    <BuyPageOffersList />
                  </Box>
                }
              />
            ))}
          </Routes>
        </Box>
      </DexPageContainer>
    </div>
  );
};

export default BuyPage;
