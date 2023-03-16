import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import DexPageContainer from '../../components/grindery/DexPageContainer/DexPageContainer';
import DexSellMenu from '../../components/grindery/DexSellMenu/DexSellMenu';
import { sellPages } from '../../components/pages/dexPages';
import OffersContextProvider from '../../context/OffersContext';
import StakesContextProvider from '../../context/StakesContext';

type Props = {};

const SellPage = (props: Props) => {
  return (
    <div>
      <StakesContextProvider>
        <OffersContextProvider>
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
        </OffersContextProvider>
      </StakesContextProvider>
    </div>
  );
};

export default SellPage;
