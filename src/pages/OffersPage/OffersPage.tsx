import React from 'react';
import DexCard from '../../components/DexCard/DexCard';
import { Route, Routes } from 'react-router-dom';
import useOffersPage from '../../hooks/useOffersPage';
import OffersPageRoot from './OffersPageRoot';
import OffersPageCreate from './OffersPageCreate';
import OffersPageSelectChain from './OffersPageSelectChain';
import OffersPageSelectToChain from './OffersPageSelectToChain';

function OffersPage() {
  const { VIEWS } = useOffersPage();

  return (
    <>
      <DexCard>
        <Routes>
          <Route path={VIEWS.ROOT.path} element={<OffersPageRoot />} />
          <Route path={VIEWS.CREATE.path} element={<OffersPageCreate />} />
          <Route
            path={VIEWS.SELECT_CHAIN.path}
            element={<OffersPageSelectChain />}
          />
          <Route
            path={VIEWS.SELECT_TO_CHAIN.path}
            element={<OffersPageSelectToChain />}
          />
        </Routes>
      </DexCard>
    </>
  );
}

export default OffersPage;
