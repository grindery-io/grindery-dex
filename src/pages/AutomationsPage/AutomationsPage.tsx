import React from 'react';
import { Route, Routes } from 'react-router-dom';
import DexCard from '../../components/DexCard/DexCard';
import AutomationsPageRoot from './AutomationsPageRoot';
import AutomationsPageSelectChain from './AutomationsPageSelectChain';
import { ROUTES } from '../../config/routes';

type Props = {};

const AutomationsPage = (props: Props) => {
  return (
    <DexCard>
      <Routes>
        <Route
          path={ROUTES.SELL.AUTOMATIONS.ROOT.RELATIVE_PATH}
          element={<AutomationsPageRoot />}
        />
        <Route
          path={ROUTES.SELL.AUTOMATIONS.SELECT_CHAIN.RELATIVE_PATH}
          element={<AutomationsPageSelectChain />}
        />
      </Routes>
    </DexCard>
  );
};

export default AutomationsPage;
