import React from 'react';
import { PageCard } from '../../components';
import { OrdersController } from '../../controllers';
import OrdersPageRoot from './OrdersPageRoot';

function OrdersPage() {
  return (
    <OrdersController>
      <PageCard>
        <OrdersPageRoot />
      </PageCard>
    </OrdersController>
  );
}

export default OrdersPage;
