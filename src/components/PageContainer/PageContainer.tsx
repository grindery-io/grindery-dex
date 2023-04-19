import React from 'react';
import { Box } from '@mui/material';

type Props = {
  topShift?: string;
  children: React.ReactNode;
};

const PageContainer = (props: Props) => {
  const { children, topShift } = props;
  return (
    <Box
      display="flex"
      minHeight={`calc(100vh - 60px - ${topShift ? topShift : '0px'})`}
      style={{ paddingBottom: '60px' }}
    >
      <Box flex={1} style={{ margin: '50px auto auto' }}>
        {children}
      </Box>
    </Box>
  );
};

export default PageContainer;
