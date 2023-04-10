import React from 'react';
import DexCard from '../../components/DexCard/DexCard';
import { Route, Routes } from 'react-router-dom';
import { FaucetMenu, Loading, PageContainer } from '../../components';
import { ROUTES } from '../../config';
import FaucetPageRoot from './FaucetPageRoot';
import FaucetPageSelectChain from './FaucetPageSelectChain';
import FaucetPagePlaceholder from './FaucetPagePlaceholder';
import { FaucetController } from '../../controllers';
import {
  useAppSelector,
  selectUserId,
  selectUserIsAdmin,
  selectUserIsAdminLoading,
} from '../../store';

function FaucetPage() {
  const isLoading = useAppSelector(selectUserIsAdminLoading);
  const isAdmin = useAppSelector(selectUserIsAdmin);
  const user = useAppSelector(selectUserId);

  if (!user) {
    return null;
  }

  if (user && isLoading) {
    return <Loading />;
  }

  return (
    <FaucetController>
      <PageContainer>
        <FaucetMenu />
        <DexCard>
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
          </Routes>
        </DexCard>
      </PageContainer>
    </FaucetController>
  );
}

export default FaucetPage;
