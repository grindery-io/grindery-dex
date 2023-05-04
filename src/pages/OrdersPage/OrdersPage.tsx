import React from 'react';
import { OrdersProvider } from '../../providers';
import OrdersPageRoot from './OrdersPageRoot';
import { Route, Routes } from 'react-router';
import { ROUTES } from '../../config';
import Page404 from '../Page404/Page404';

function OrdersPage() {
  return (
    <OrdersProvider>
      <Routes>
        <Route
          path={ROUTES.SELL.ORDERS.ROOT.RELATIVE_PATH}
          element={<OrdersPageRoot />}
        />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </OrdersProvider>
  );
}

export default OrdersPage;
