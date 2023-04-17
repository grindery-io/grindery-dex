import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { PageContainer } from '../../components';
import TradePage from '../TradePage/TradePage';
import ShopPage from '../ShopPage/ShopPage';
import { ROUTES } from '../../config';
import Page404 from '../Page404/Page404';

type Props = {};

const BuyPage = (props: Props) => {
  return (
    <div>
      <PageContainer>
        <Routes>
          <Route
            path={ROUTES.BUY.TRADE.RELATIVE_PATH}
            element={<TradePage />}
          />
          <Route path={ROUTES.BUY.SHOP.RELATIVE_PATH} element={<ShopPage />} />
          <Route
            path="/"
            element={<Navigate to={ROUTES.BUY.TRADE.FULL_PATH} />}
          />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </PageContainer>
    </div>
  );
};

export default BuyPage;
