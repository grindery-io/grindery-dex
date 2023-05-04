import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AutomationsPageRoot from './AutomationsPageRoot';
import AutomationsPageSelectChain from './AutomationsPageSelectChain';
import { ROUTES } from '../../config';
import { AutomationsProvider } from '../../providers';
import { PageCard } from '../../components';
import Page404 from '../Page404/Page404';

type Props = {};

const AutomationsPage = (props: Props) => {
  return (
    <AutomationsProvider>
      <PageCard>
        <Routes>
          <Route
            path={ROUTES.SELL.AUTOMATIONS.ROOT.RELATIVE_PATH}
            element={<AutomationsPageRoot />}
          />
          <Route
            path={ROUTES.SELL.AUTOMATIONS.SELECT_CHAIN.RELATIVE_PATH}
            element={<AutomationsPageSelectChain />}
          />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </PageCard>
    </AutomationsProvider>
  );
};

export default AutomationsPage;
