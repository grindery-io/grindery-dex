import React from 'react';
import { Box, SxProps } from '@mui/material';

type Props = {
  children: React.ReactNode;
  maxHeight?: string;
  sx?: SxProps | React.CSSProperties;
  id?: string;
};

const PageCardBody = (props: Props) => {
  const { children, maxHeight, sx, id } = props;
  return (
    <Box
      id={id}
      sx={{
        maxHeight: maxHeight || 'auto',
        overflow: maxHeight ? 'auto' : 'initial',
        paddingLeft: '24px',
        paddingRight: '24px',
        paddingTop: '62px',
        borderTopRightRadius: '12px',
        borderTopLeftRadius: '12px',
        ...(sx || {}),
      }}
    >
      {children}
    </Box>
  );
};

export default PageCardBody;
