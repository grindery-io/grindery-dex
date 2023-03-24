import React from 'react';
import { ListSubheader as MuiListSubheader } from '@mui/material';

type Props = {
  children: React.ReactNode;
  position?: 'sticky' | 'relative';
};

const ListSubheader = (props: Props) => {
  const { children, position } = props;
  return (
    <MuiListSubheader
      sx={{
        paddingLeft: 0,
        lineHeight: '2',
        background: '#fff',
        position: position || 'relative',
        zIndex: '2',
      }}
    >
      {children}
    </MuiListSubheader>
  );
};

export default ListSubheader;
