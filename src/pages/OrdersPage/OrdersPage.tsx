import React from 'react';
import { DexCard } from '../../components';
import { OrdersController } from '../../controllers';
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
