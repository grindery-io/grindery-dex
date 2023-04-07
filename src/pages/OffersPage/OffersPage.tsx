import React from 'react';
import DexCard from '../../components/DexCard/DexCard';
import { Route, Routes } from 'react-router-dom';
import OffersPageRoot from './OffersPageRoot';
import OffersPageCreate from './OffersPageCreate';
import OffersPageSelectChain from './OffersPageSelectChain';
import OffersPageSelectToChain from './OffersPageSelectToChain';
import OffersController from '../../controllers/OffersController';
import { ROUTES } from '../../config/routes';

function OffersPage() {
  return (
    <OffersController>
      <DexCard>
        <Routes>
          <Route
            path={ROUTES.SELL.OFFERS.ROOT.RELATIVE_PATH}
            element={<OffersPageRoot />}
          />
          <Route
            path={ROUTES.SELL.OFFERS.CREATE.RELATIVE_PATH}
            element={<OffersPageCreate />}
          />
          <Route
            path={ROUTES.SELL.OFFERS.SELECT_CHAIN.RELATIVE_PATH}
            element={<OffersPageSelectChain />}
          />
          <Route
            path={ROUTES.SELL.OFFERS.SELECT_TO_CHAIN.RELATIVE_PATH}
            element={<OffersPageSelectToChain />}
          />
        </Routes>
      </DexCard>
    </OffersController>
  );
}

export default OffersPage;
