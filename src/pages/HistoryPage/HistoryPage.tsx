import React from 'react';
import { PageContainer } from '../../components';
import { Route, Routes } from 'react-router';
import { ROUTES } from '../../config';
import HistoryPageRoot from './HistoryPageRoot';
import { OrdersHistoryController } from '../../controllers';
import Page404 from '../Page404/Page404';

type Props = {};

const HistoryPage = (props: Props) => {
  return (
    <OrdersHistoryController>
      <PageContainer>
        <Routes>
          <Route
            path={ROUTES.HISTORY.ROOT.RELATIVE_PATH}
            element={<HistoryPageRoot />}
          />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </PageContainer>
    </OrdersHistoryController>
  );
};

export default HistoryPage;
