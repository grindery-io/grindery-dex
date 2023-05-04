import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { PageCard } from '../../components';
import StakingPageRoot from './StakingPageRoot';
import StakingPageStake from './StakingPageStake';
import StakingPageWithdraw from './StakingPageWithdraw';
import StakingPageSelectChain from './StakingPageSelectChain';
import { ROUTES } from '../../config';
import { StakesProvider } from '../../providers';
import Page404 from '../Page404/Page404';

function StakingPage() {
  return (
    <StakesProvider>
      <PageCard>
        <Routes>
          <Route
            path={ROUTES.SELL.STAKING.ROOT.RELATIVE_PATH}
            element={<StakingPageRoot />}
          />
          <Route
            path={ROUTES.SELL.STAKING.STAKE.RELATIVE_PATH}
            element={<StakingPageStake />}
          />
          <Route
            path={ROUTES.SELL.STAKING.WITHDRAW.RELATIVE_PATH}
            element={<StakingPageWithdraw />}
          />
          <Route
            path={ROUTES.SELL.STAKING.SELECT_CHAIN.RELATIVE_PATH}
            element={<StakingPageSelectChain />}
          />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </PageCard>
    </StakesProvider>
  );
}

export default StakingPage;
