import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import DexPageContainer from '../../components/grindery/DexPageContainer/DexPageContainer';
import DexSellMenu from '../../components/grindery/DexSellMenu/DexSellMenu';
import { sellPages } from '../../components/pages/dexPages';

type Props = {};

const SellPage = (props: Props) => {
  return (
    <div>
      <DexPageContainer>
        <DexSellMenu />
        <Routes>
          {sellPages.map((page: any) => (
            <Route
              key={page.path}
              path={`${page.path}/*`}
              element={<page.ContextProvider children={page.component} />}
            />
          ))}
          <Route
            path="/"
            element={<Navigate to={`/sell${sellPages[0].path}`} />}
          />
        </Routes>
      </DexPageContainer>
    </div>
  );
};

export default SellPage;
