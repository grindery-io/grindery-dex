import React from 'react';
import { CircularProgress } from '@mui/material';

type Props = {
  size?: number;
  style?: { [key: string]: string | number };
};

const DexLoading = (props: Props) => {
  const { size, style } = props;
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
      <CircularProgress color="inherit" size={size} />
    </div>
  );
};

export default DexLoading;
