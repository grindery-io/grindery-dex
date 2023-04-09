import React from 'react';
import DexCard from '../../components/DexCard/DexCard';
import OrdersController from '../../controllers/OrdersController';
import OrdersPageRoot from './OrdersPageRoot';

function OrdersPage() {
  return (
    <OrdersController>
      <DexCard>
        <OrdersPageRoot />
      </DexCard>
    </OrdersController>
  );
}

export default OrdersPage;
