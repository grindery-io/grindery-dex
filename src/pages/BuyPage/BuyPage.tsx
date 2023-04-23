import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import TradePage from '../TradePage/TradePage';
import ShopPage from '../ShopPage/ShopPage';
import { ROUTES } from '../../config';
import Page404 from '../Page404/Page404';

type Props = {};

const BuyPage = (props: Props) => {
  return (
    <div>
      <Routes>
        <Route path={ROUTES.BUY.SHOP.RELATIVE_PATH} element={<ShopPage />} />
        <Route path={ROUTES.BUY.TRADE.RELATIVE_PATH} element={<TradePage />} />
        <Route path="/" element={<Navigate to={ROUTES.BUY.SHOP.FULL_PATH} />} />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </div>
  );
};

export default BuyPage;
