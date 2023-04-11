import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { PageContainer } from '../../components';
import TradePage from '../TradePage/TradePage';
import ShopPage from '../ShopPage/ShopPage';
import { ROUTES } from '../../config';

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
          <Route path="/" element={<Navigate to="/buy/trade" />} />
        </Routes>
      </PageContainer>
    </div>
  );
};

export default BuyPage;
