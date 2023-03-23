import React from 'react';
import DexCard from '../../components/grindery/DexCard/DexCard';
import { Navigate, Route, Routes } from 'react-router-dom';
import useFaucetPage from '../../hooks/useFaucetPage';
import FaucetPageRoot from './FaucetPageRoot';
import FaucetPageSelectChain from './FaucetPageSelectChain';
import DexFaucetMenu from '../../components/grindery/DexFaucetMenu/DexFaucetMenu';
import useAdmin from '../../hooks/useAdmin';
import DexLoading from '../../components/grindery/DexLoading/DexLoading';

function FaucetPage() {
  const { VIEWS } = useFaucetPage();
  const { isLoading, isAdmin } = useAdmin();
  if (isLoading) {
    return <DexLoading />;
  }

  return isAdmin ? (
    <>
      <DexFaucetMenu />
      <DexCard>
        <Routes>
          <Route path={VIEWS.ROOT.path} element={<FaucetPageRoot />} />
          <Route
            path={VIEWS.SELECT_CHAIN.path}
            element={<FaucetPageSelectChain />}
          />
        </Routes>
      </DexCard>
    </>
  ) : (
    <Navigate to="/" />
  );
}

export default FaucetPage;
