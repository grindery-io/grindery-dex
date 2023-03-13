import React from 'react';
import { CircularProgress } from '@mui/material';

type Props = {};

const DexLoading = (props: Props) => {
  return (
    <div
      style={{
        textAlign: 'center',
        color: '#3f49e1',
        width: '100%',
        margin: '20px 0',
      }}
    >
      <CircularProgress color="inherit" />
    </div>
  );
};

export default DexLoading;
