import React from 'react';
import { DrawerProps, Drawer as MuiDrawer } from '@mui/material';

const Drawer = (props: DrawerProps) => {
  return (
    <MuiDrawer
      {...props}
      sx={{
        ...(props.sx || {}),
      }}
    />
  );
};

export default Drawer;
