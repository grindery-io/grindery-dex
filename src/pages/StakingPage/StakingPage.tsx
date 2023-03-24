import React from 'react';
import { Route, Routes } from 'react-router-dom';
import DexCard from '../../components/DexCard/DexCard';
import useStakingPage from '../../hooks/useStakingPage';
import StakingPageRoot from './StakingPageRoot';
import StakingPageStake from './StakingPageStake';
import StakingPageWithdraw from './StakingPageWithdraw';
import StakingPageSelectChain from './StakingPageSelectChain';

function StakingPage() {
  const { VIEWS } = useStakingPage();

  return (
    <>
      <DexCard>
        <Routes>
          <Route path={VIEWS.ROOT.path} element={<StakingPageRoot />} />
          <Route path={VIEWS.STAKE.path} element={<StakingPageStake />} />
          <Route path={VIEWS.WITHDRAW.path} element={<StakingPageWithdraw />} />
          <Route
            path={VIEWS.SELECT_CHAIN.path}
            element={<StakingPageSelectChain />}
          />
        </Routes>
      </DexCard>
    </>
  );
}

export default StakingPage;
