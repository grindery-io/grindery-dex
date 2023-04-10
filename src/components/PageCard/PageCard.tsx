import React, { ReactNode } from 'react';
import { Box } from '@mui/system';

type Props = {
  children: ReactNode;
};

const PageCard = (props: Props) => {
  const { children } = props;
  return (
    <Box style={{ margin: '0 auto auto', maxWidth: '392px' }}>
      <Box
        style={{
          padding: '0',
          boxShadow: '0px 8px 32px rgb(0 0 0 / 8%)',
          borderRadius: '16px',
          background: '#fff',
          position: 'relative',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default PageCard;
