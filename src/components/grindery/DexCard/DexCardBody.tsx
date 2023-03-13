import { Box } from '@mui/material';
import React from 'react';

type Props = {
  children: React.ReactNode;
  maxHeight?: string;
};

const DexCardBody = (props: Props) => {
  const { children, maxHeight } = props;
  return (
    <Box
      style={{
        maxHeight: maxHeight || 'auto',
        overflow: maxHeight ? 'auto' : 'initial',
        paddingLeft: '24px',
        paddingRight: '24px',
      }}
    >
      {children}
    </Box>
  );
};

export default DexCardBody;
