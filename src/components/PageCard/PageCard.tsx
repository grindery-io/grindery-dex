import React, { ReactNode } from 'react';
import { Box } from '@mui/system';
import { SxProps } from '@mui/material';

type Props = {
  children: ReactNode;
  containerStyle?: SxProps | React.CSSProperties;
  wrapperStyle?: SxProps | React.CSSProperties;
};

const PageCard = (props: Props) => {
  const { children, containerStyle, wrapperStyle } = props;
  return (
    <Box
      sx={{
        margin: '0 auto auto',
        maxWidth: '392px',
        ...(containerStyle || {}),
      }}
    >
      <Box
        sx={{
          padding: '0',
          boxShadow: '0px 8px 32px rgb(0 0 0 / 8%)',
          borderRadius: '16px',
          background: '#fff',
          position: 'relative',
          ...(wrapperStyle || {}),
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default PageCard;
