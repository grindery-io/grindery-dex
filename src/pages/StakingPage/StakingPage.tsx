import React from 'react';
import { Route, Routes } from 'react-router-dom';
import DexCard from '../../components/DexCard/DexCard';
import StakingPageRoot from './StakingPageRoot';
import StakingPageStake from './StakingPageStake';
import StakingPageWithdraw from './StakingPageWithdraw';
import StakingPageSelectChain from './StakingPageSelectChain';
import { ROUTES } from '../../config/routes';

function StakingPage() {
  return (
    <>
      <DexCard>
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
        </Routes>
      </DexCard>
    </>
  );
}

export default StakingPage;
