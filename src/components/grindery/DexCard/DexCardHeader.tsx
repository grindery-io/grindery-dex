import React, { ReactNode } from 'react';
import { Typography } from '@mui/material';
import { HeaderAppBar } from '../../Header/Header.style';

type Props = {
  title?: string;
  titleAlign?: 'left' | 'center' | 'right';
  titleSize?: number;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
};

const DexCardHeader = (props: Props) => {
  const { title, endAdornment, startAdornment, titleAlign, titleSize } = props;
  return (
    <HeaderAppBar
      elevation={0}
      style={{
        paddingLeft: '24px',
        paddingRight: '24px',
        paddingBottom: '10px',
      }}
    >
      {startAdornment || null}
      <Typography
        fontSize={titleSize || 24}
        align={titleAlign || 'left'}
        fontWeight="700"
        flex={1}
        noWrap
      >
        {title || ''}
      </Typography>
      {endAdornment || null}
    </HeaderAppBar>
  );
};

export default DexCardHeader;
