import React from 'react';
import { ListSubheader } from '@mui/material';

type Props = {
  children: React.ReactNode;
  position?: 'sticky' | 'relative';
};

const DexListSubheader = (props: Props) => {
  const { children, position } = props;
  return (
    <ListSubheader
      sx={{
        paddingLeft: 0,
        lineHeight: '2',
        background: '#fff',
        position: position || 'relative',
        zIndex: '2',
      }}
    >
      {children}
    </ListSubheader>
  );
};

export default DexListSubheader;
