import React from 'react';
import { Route, Routes } from 'react-router-dom';
import DexCard from '../../components/DexCard/DexCard';
import useAutomationsPage from '../../hooks/useAutomationsPage';
import AutomationsPageRoot from './AutomationsPageRoot';
import AutomationsPageSelectChain from './AutomationsPageSelectChain';

type Props = {};

const AutomationsPage = (props: Props) => {
  const { VIEWS } = useAutomationsPage();
  return (
    <DexCard>
      <Routes>
        <Route path={VIEWS.ROOT.path} element={<AutomationsPageRoot />} />
        <Route
          path={VIEWS.SELECT_CHAIN.path}
          element={<AutomationsPageSelectChain />}
        />
      </Routes>
    </DexCard>
  );
};

export default AutomationsPage;
