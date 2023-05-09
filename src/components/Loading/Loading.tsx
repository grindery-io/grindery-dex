import React from 'react';
import { CircularProgress, SxProps } from '@mui/material';

type Props = {
  size?: number;
  style?: React.CSSProperties;
  progressStyle?: SxProps | React.CSSProperties;
};

const Loading = (props: Props) => {
  const { size, style, progressStyle } = props;
  return (
    <div
      style={{
        textAlign: 'center',
        color: '#3f49e1',
        width: '100%',
        margin: '20px 0',
        ...style,
      }}
    >
      <CircularProgress color="inherit" size={size} sx={progressStyle} />
    </div>
  );
};

export default Loading;
