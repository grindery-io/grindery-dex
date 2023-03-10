import { Box } from '@mui/system';
import React, { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

const DexCard = (props: Props) => {
  const { children } = props;
  return (
    <Box style={{ margin: '0 auto auto', maxWidth: '392px' }}>
      <Box
        style={{
          padding: '0',
          boxShadow: '0px 8px 32px rgb(0 0 0 / 8%)',
          borderRadius: '16px',
          background: '#fff',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default DexCard;
