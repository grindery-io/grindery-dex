import React from 'react';
import { Box } from '@mui/system';
import { Route, Routes } from 'react-router-dom';
import ShopPageRoot from './ShopPageRoot';
import { ShopController } from '../../controllers';
import { ROUTES } from '../../config';
import Page404 from '../Page404/Page404';

type Props = {};

const ShopPage = (props: Props) => {
  return (
    <ShopController>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="center"
        flexWrap="wrap"
      >
        <Routes>
          <Route
            path={ROUTES.BUY.SHOP.ROOT.RELATIVE_PATH}
            element={<ShopPageRoot />}
          />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </Box>
    </ShopController>
  );
};

export default ShopPage;
