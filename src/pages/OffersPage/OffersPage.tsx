import React from 'react';
import DexCard from '../../components/grindery/DexCard/DexCard';
import { Route, Routes } from 'react-router-dom';
import useOffersPage from '../../hooks/useOffersPage';
import OffersPageRoot from './OffersPageRoot';
import OffersPageCreate from './OffersPageCreate';
import OffersPageSelectChain from './OffersPageSelectChain';

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
        </Routes>
      </DexCard>
    </>
  );
}

export default OffersPage;
