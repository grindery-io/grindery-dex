import React from 'react';
import { Box, Skeleton, Stack } from '@mui/material';
import { Card } from '../Card/Card';

type Props = {};

const OrderSkeleton = (props: Props) => {
  return (
    <Card
      flex={1}
      style={{
        borderRadius: '12px',
        marginBottom: '12px',
        backgroundColor: '#fff',
      }}
    >
      <Box
        sx={{
          '& .MuiSkeleton-root': {
            transform: 'initial',
          },
        }}
      >
        <Box sx={{ margin: '16px 16px 0' }}>
          <Skeleton height="14px" sx={{ marginBottom: '6px' }} />
          <Skeleton height="14px" />
        </Box>

        <Box sx={{ margin: '16px 16px 0' }}>
          <Skeleton width="150px" height="60px" />
        </Box>
        <Box sx={{ margin: '16px 16px 0' }}>
          <Skeleton width="150px" height="30px" />
        </Box>
        <Box sx={{ margin: '16px 16px 0' }}>
          <Skeleton width="150px" height="30px" />
        </Box>
        <Box sx={{ margin: '16px 16px 0' }}>
          <Skeleton width="150px" height="30px" />
        </Box>
        <Box sx={{ margin: '16px' }}>
          <Skeleton height="35px" />
        </Box>
      </Box>
    </Card>
  );
};

export default OrderSkeleton;
