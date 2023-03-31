import React from 'react';
import { DrawerProps, Drawer as MuiDrawer } from '@mui/material';

const DrawerDesktop = (props: DrawerProps) => {
  return (
    <MuiDrawer
      {...props}
      sx={{
        '& .MuiPaper-root': {
          background: 'transparent',
          borderRight: 'none',
          padding: '0 16px',
          '& .MuiListItem-root': {
            margin: '4px 0',
          },
          '& .MuiListItemButton-root': {
            borderRadius: '12px',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
            '&.Mui-selected': {
              backgroundColor: 'rgba(25, 118, 210, 0.08)',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
              },
            },
          },
        },
        ...(props.sx || {}),
      }}
    />
  );
};

export default DrawerDesktop;
