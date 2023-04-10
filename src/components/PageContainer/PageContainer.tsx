import React from 'react';
import { Box } from '@mui/material';

type Props = {
  children: React.ReactNode;
};

const PageContainer = (props: Props) => {
  const { children } = props;
  return (
    <Box
      display="flex"
      minHeight="calc(100vh - 75px - 60px)"
      style={{ paddingTop: '75px', paddingBottom: '60px' }}
    >
      <Box flex={1} style={{ margin: '50px auto auto' }}>
        {children}
      </Box>
    </Box>
  );
};

export default PageContainer;
