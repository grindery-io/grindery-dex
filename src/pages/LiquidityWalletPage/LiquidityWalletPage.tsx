import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { PageCard } from '../../components';
import LiquidityWalletPageRoot from './LiquidityWalletPageRoot';
import LiquidityWalletPageCreate from './LiquidityWalletPageCreate';
import LiquidityWalletPageWithdraw from './LiquidityWalletPageWithdraw';
import LiquidityWalletPageAdd from './LiquidityWalletPageAdd';
import LiquidityWalletPageSelectChain from './LiquidityWalletPageSelectChain';
import LiquidityWalletPageTokens from './LiquidityWalletPageTokens';
import LiquidityWalletPageSelectToken from './LiquidityWalletPageSelectToken';
import { ROUTES } from '../../config';

function LiquidityWalletPage() {
  return (
    <>
      <PageCard>
        <Routes>
          <Route
            path={ROUTES.SELL.WALLETS.ROOT.RELATIVE_PATH}
            element={<LiquidityWalletPageRoot />}
          />
          <Route
            path={ROUTES.SELL.WALLETS.TOKENS.RELATIVE_PATH}
            element={<LiquidityWalletPageTokens />}
          />
          <Route
            path={ROUTES.SELL.WALLETS.CREATE.RELATIVE_PATH}
            element={<LiquidityWalletPageCreate />}
          />
          <Route
            path={ROUTES.SELL.WALLETS.WITHDRAW.RELATIVE_PATH}
            element={<LiquidityWalletPageWithdraw />}
          />
          <Route
            path={ROUTES.SELL.WALLETS.ADD.RELATIVE_PATH}
            element={<LiquidityWalletPageAdd />}
          />
          <Route
            path={ROUTES.SELL.WALLETS.SELECT_CHAIN.RELATIVE_PATH}
            element={<LiquidityWalletPageSelectChain />}
          />
          <Route
            path={ROUTES.SELL.WALLETS.SELECT_TOKEN.RELATIVE_PATH}
            element={<LiquidityWalletPageSelectToken />}
          />
        </Routes>
      </PageCard>
    </>
  );
}

export default LiquidityWalletPage;
