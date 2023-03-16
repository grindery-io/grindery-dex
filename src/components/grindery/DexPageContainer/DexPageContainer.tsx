import React from 'react';
import { ThemeProvider as GrinderyThemeProvider } from 'grindery-ui';
import { Box } from '@mui/material';

type Props = {
  children: React.ReactNode;
};

const DexPageContainer = (props: Props) => {
  const { children } = props;
  return (
    <GrinderyThemeProvider>
      <Box
        display="flex"
        minHeight="calc(100vh - 75px - 60px)"
        style={{ paddingTop: '75px', paddingBottom: '60px' }}
      >
        <Box flex={1} style={{ margin: '50px auto auto' }}>
          {children}
        </Box>
      </Box>
    </GrinderyThemeProvider>
  );
};

export default DexPageContainer;
