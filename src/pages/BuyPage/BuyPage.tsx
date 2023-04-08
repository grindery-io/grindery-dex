import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import PageContainer from '../../components/PageContainer/PageContainer';
import TradePageContextProvider from '../../context/TradePageContext';
import TradePage from '../TradePage/TradePage';
import ShopPage from '../ShopPage/ShopPage';

export const buyPages = [
  {
    path: '/trade',
    fullPath: '/buy/trade',
    label: 'Trade',
    component: (
      <TradePageContextProvider>
        <TradePage />
      </TradePageContextProvider>
    ),
  },
  {
    path: '/shop',
    fullPath: '/buy/shop',
    label: 'Shop',
    component: <ShopPage />,
  },
];

type Props = {};

const BuyPage = (props: Props) => {
  return (
    <div>
      <PageContainer>
        <Routes>
          {buyPages.map((page: any) => (
            <Route
              key={page.path}
              path={`${page.path}/*`}
              element={page.component}
            />
          ))}
          <Route
            path="/"
            element={<Navigate to={`/buy${buyPages[0].path}`} />}
          />
        </Routes>
      </PageContainer>
    </div>
  );
};

export default BuyPage;
