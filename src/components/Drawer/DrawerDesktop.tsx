import React from 'react';
import { DrawerProps, Drawer as MuiDrawer } from '@mui/material';

const DrawerDesktop = (props: DrawerProps) => {
  return (
    <MuiDrawer
      {...props}
      sx={{
        '& .MuiPaper-root': {
          borderRight: 'none',
          padding: '0 16px',
          '& .MuiListItem-root': {
            margin: '4px 0',
          },
          '& .MuiListItemButton-root': {
            borderRadius: '12px',
          },
        },
        ...(props.sx || {}),
      }}
    />
  );
};

export default DrawerDesktop;
