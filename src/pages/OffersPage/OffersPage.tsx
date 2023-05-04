import React from 'react';
import { PageCard } from '../../components';
import { Route, Routes } from 'react-router-dom';
import OffersPageRoot from './OffersPageRoot';
import OffersPageCreate from './OffersPageCreate';
import OffersPageSelectChain from './OffersPageSelectChain';
import OffersPageSelectToChain from './OffersPageSelectToChain';
import { OffersProvider } from '../../providers';
import { ROUTES } from '../../config';
import Page404 from '../Page404/Page404';

function OffersPage() {
  return (
    <OffersProvider>
      <PageCard>
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
          <Route path="*" element={<Page404 />} />
        </Routes>
      </PageCard>
    </OffersProvider>
  );
}

export default OffersPage;
