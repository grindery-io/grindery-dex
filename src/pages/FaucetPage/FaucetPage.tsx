import React from 'react';
import DexCard from '../../components/grindery/DexCard/DexCard';
import { Route, Routes } from 'react-router-dom';
import useFaucetPage from '../../hooks/useFaucetPage';
import FaucetPageRoot from './FaucetPageRoot';
import FaucetPageSelectChain from './FaucetPageSelectChain';

function FaucetPage() {
  const { VIEWS } = useFaucetPage();

  return (
    <>
      <DexCard>
        <Routes>
          <Route path={VIEWS.ROOT.path} element={<FaucetPageRoot />} />
          <Route
            path={VIEWS.SELECT_CHAIN.path}
            element={<FaucetPageSelectChain />}
          />
        </Routes>
      </DexCard>
    </>
  );
}

export default FaucetPage;
