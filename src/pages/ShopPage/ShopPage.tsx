import React from 'react';
import { Box } from '@mui/system';
import { Route, Routes } from 'react-router-dom';
import ShopPageRoot from './ShopPageRoot';
import ShopController from '../../controllers/ShopController';
import { ROUTES } from '../../config/routes';

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
        </Routes>
      </Box>
    </ShopController>
  );
};

export default ShopPage;
