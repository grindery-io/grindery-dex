import React from 'react';
import { OrdersController } from '../../controllers';
import OrdersPageRoot from './OrdersPageRoot';
import { Route, Routes } from 'react-router';
import { ROUTES } from '../../config';
import Page404 from '../Page404/Page404';

function OrdersPage() {
  return (
    <OrdersController>
      <Routes>
        <Route
          path={ROUTES.SELL.ORDERS.ROOT.RELATIVE_PATH}
          element={<OrdersPageRoot />}
        />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </OrdersController>
  );
}

export default OrdersPage;
