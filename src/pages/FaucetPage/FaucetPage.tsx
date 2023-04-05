import React from 'react';
import DexCard from '../../components/DexCard/DexCard';
import { Route, Routes } from 'react-router-dom';
import FaucetMenu from '../../components/FaucetMenu/FaucetMenu';
import { ROUTES } from '../../config/routes';
import FaucetPageRoot from './FaucetPageRoot';
import FaucetPageSelectChain from './FaucetPageSelectChain';
import FaucetPagePlaceholder from './FaucetPagePlaceholder';
import FaucetController from '../../controllers/FaucetController';

function FaucetPage() {
  return (
    <FaucetController>
      <FaucetMenu />
      <DexCard>
        <Routes>
          <Route
            path={ROUTES.FAUCET.PLACEHOLDER.RELATIVE_PATH}
            element={<FaucetPagePlaceholder />}
          />
          <Route
            path={ROUTES.FAUCET.ROOT.RELATIVE_PATH}
            element={<FaucetPageRoot />}
          />
          <Route
            path={ROUTES.FAUCET.SELECT_CHAIN.RELATIVE_PATH}
            element={<FaucetPageSelectChain />}
          />
        </Routes>
      </DexCard>
    </FaucetController>
  );
}

export default FaucetPage;
