import React from 'react';
import DexCard from '../../components/grindery/DexCard/DexCard';
import { Route, Routes } from 'react-router-dom';
import useLiquidityWalletPage from '../../hooks/useLiquidityWalletPage';
import LiquidityWalletPageRoot from './LiquidityWalletPageRoot';
import LiquidityWalletPageCreate from './LiquidityWalletPageCreate';
import LiquidityWalletPageWithdraw from './LiquidityWalletPageWithdraw';
import LiquidityWalletPageAdd from './LiquidityWalletPageAdd';
import LiquidityWalletPageSelectChain from './LiquidityWalletPageSelectChain';
import LiquidityWalletPageTokens from './LiquidityWalletPageTokens';
import LiquidityWalletPageSelectToken from './LiquidityWalletPageSelectToken';

function LiquidityWalletPage() {
  const { VIEWS } = useLiquidityWalletPage();

  return (
    <>
      <DexCard>
        <Routes>
          <Route path={VIEWS.ROOT.path} element={<LiquidityWalletPageRoot />} />
          <Route
            path={VIEWS.TOKENS.path}
            element={<LiquidityWalletPageTokens />}
          />
          <Route
            path={VIEWS.CREATE.path}
            element={<LiquidityWalletPageCreate />}
          />
          <Route
            path={VIEWS.WITHDRAW.path}
            element={<LiquidityWalletPageWithdraw />}
          />
          <Route path={VIEWS.ADD.path} element={<LiquidityWalletPageAdd />} />
          <Route
            path={VIEWS.SELECT_CHAIN.path}
            element={<LiquidityWalletPageSelectChain />}
          />
          <Route
            path={VIEWS.SELECT_TOKEN.path}
            element={<LiquidityWalletPageSelectToken />}
          />
        </Routes>
      </DexCard>
    </>
  );
}

export default LiquidityWalletPage;
