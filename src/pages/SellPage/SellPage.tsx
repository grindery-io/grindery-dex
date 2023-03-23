import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import DexLoading from '../../components/grindery/DexLoading/DexLoading';
import DexPageContainer from '../../components/grindery/DexPageContainer/DexPageContainer';
import DexSellMenu from '../../components/grindery/DexSellMenu/DexSellMenu';
import { sellPages } from '../../components/pages/dexPages';
import useAdmin from '../../hooks/useAdmin';

type Props = {};

const SellPage = (props: Props) => {
  const { isLoading, isAdmin } = useAdmin();
  if (isLoading) {
    return <DexLoading />;
  }
  return isAdmin ? (
    <div>
      <DexPageContainer>
        <DexSellMenu />
        <Routes>
          {sellPages.map((page: any) => (
            <Route
              key={page.path}
              path={`${page.path}/*`}
              element={page.component}
            />
          ))}
          <Route
            path="/"
            element={<Navigate to={`/sell${sellPages[0].path}`} />}
          />
        </Routes>
      </DexPageContainer>
    </div>
  ) : (
    <Navigate to="/" />
  );
};

export default SellPage;
