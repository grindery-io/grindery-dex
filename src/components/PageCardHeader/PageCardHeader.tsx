import React, { ReactNode } from 'react';
import { SxProps, Typography } from '@mui/material';
import { PageCardHeaderAppBar } from './PageCardHeaderAppBar';

type Props = {
  title?: string | React.ReactNode;
  titleAlign?: 'left' | 'center' | 'right';
  titleSize?: number;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  sx?: SxProps | React.CSSProperties;
};

const PageCardHeader = (props: Props) => {
  const { title, endAdornment, startAdornment, titleAlign, titleSize, sx } =
    props;
  return (
    <>
      <PageCardHeaderAppBar
        elevation={0}
        sx={{
          paddingLeft: '24px',
          paddingRight: '24px',
          paddingBottom: '10px',
          backdropFilter: 'blur(12px)',
          background: 'rgba(255,255,255,0.84)',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          borderTopRightRadius: '12px',
          borderTopLeftRadius: '12px',
          overflow: 'hidden',
          ...(sx || {}),
        }}
      >
        {startAdornment || null}
        <Typography
          fontSize={titleSize || 24}
          align={titleAlign || 'left'}
          fontWeight="700"
          flex={1}
          noWrap
          className="PageCardHeader__typography"
        >
          {title || ''}
        </Typography>
        {endAdornment || null}
      </PageCardHeaderAppBar>
    </>
  );
};

export default PageCardHeader;
