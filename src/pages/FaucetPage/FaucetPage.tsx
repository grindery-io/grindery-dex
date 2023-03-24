import React from 'react';
import DexCard from '../../components/DexCard/DexCard';
import { Navigate, Route, Routes } from 'react-router-dom';
import useFaucetPage from '../../hooks/useFaucetPage';
import FaucetPageRoot from './FaucetPageRoot';
import FaucetPageSelectChain from './FaucetPageSelectChain';
import FaucetMenu from '../../components/FaucetMenu/FaucetMenu';
import useAdmin from '../../hooks/useAdmin';
import Loading from '../../components/Loading/Loading';

function FaucetPage() {
  const { VIEWS } = useFaucetPage();
  const { isLoading, isAdmin } = useAdmin();
  if (isLoading) {
    return <Loading />;
  }

  return isAdmin ? (
    <>
      <FaucetMenu />
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
