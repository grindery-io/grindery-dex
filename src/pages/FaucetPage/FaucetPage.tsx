import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { FaucetMenu, Loading, PageCard } from '../../components';
import { ROUTES } from '../../config';
import FaucetPageRoot from './FaucetPageRoot';
import FaucetPageSelectChain from './FaucetPageSelectChain';
import FaucetPagePlaceholder from './FaucetPagePlaceholder';
import { FaucetProvider } from '../../providers';
import { useAppSelector, selectUserStore } from '../../store';
import Page404 from '../Page404/Page404';

function FaucetPage() {
  const {
    id: user,
    isAdmin,
    isAdminLoading: isLoading,
  } = useAppSelector(selectUserStore);

  if (!user) {
    return null;
  }

  if (user && isLoading) {
    return <Loading />;
  }

  return (
    <FaucetProvider>
      <FaucetMenu />
      <PageCard>
        <Routes>
          <Route
            path={ROUTES.FAUCET.PLACEHOLDER.RELATIVE_PATH}
            element={<FaucetPagePlaceholder />}
          />
          {isAdmin && (
            <>
              <Route
                path={ROUTES.FAUCET.ROOT.RELATIVE_PATH}
                element={<FaucetPageRoot />}
              />
              <Route
                path={ROUTES.FAUCET.SELECT_CHAIN.RELATIVE_PATH}
                element={<FaucetPageSelectChain />}
              />
            </>
          )}
          <Route path="*" element={<Page404 />} />
        </Routes>
      </PageCard>
    </FaucetProvider>
  );
}

export default FaucetPage;
