import React from 'react';
import DexCard from '../../components/DexCard/DexCard';
import { Route, Routes } from 'react-router-dom';
import LiquidityWalletPageRoot from './LiquidityWalletPageRoot';
import LiquidityWalletPageCreate from './LiquidityWalletPageCreate';
import LiquidityWalletPageWithdraw from './LiquidityWalletPageWithdraw';
import LiquidityWalletPageAdd from './LiquidityWalletPageAdd';
import LiquidityWalletPageSelectChain from './LiquidityWalletPageSelectChain';
import LiquidityWalletPageTokens from './LiquidityWalletPageTokens';
import LiquidityWalletPageSelectToken from './LiquidityWalletPageSelectToken';
import { ROUTES } from '../../config/routes';

function LiquidityWalletPage() {
  return (
    <>
      <DexCard>
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
      </DexCard>
    </>
  );
}

export default LiquidityWalletPage;
