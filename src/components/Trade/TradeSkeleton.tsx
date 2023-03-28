import React from 'react';
import { Box, Skeleton, Stack } from '@mui/material';
import { Card } from '../Card/Card';

type Props = {};

const TradeSkeleton = (props: Props) => {
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
        <Stack
          direction="row"
          sx={{ margin: '16px 16px 0' }}
          justifyContent="space-between"
          alignItems="center"
        >
          <Skeleton width="150px" height="14px" />
          <Skeleton width="80px" height="24px" sx={{ borderRadius: '16px' }} />
        </Stack>
        <Box sx={{ margin: '20px 16px 0' }}>
          <Skeleton width="100px" height="16px" />
          <Stack
            sx={{ marginTop: '16px' }}
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
          >
            <Skeleton
              width="40px"
              height="40px"
              variant="circular"
              sx={{ marginRight: '16px' }}
            />
            <Box>
              <Skeleton width="80px" height="22px" />
              <Skeleton width="150px" height="14px" sx={{ marginTop: '4px' }} />
            </Box>
          </Stack>
          <Skeleton width="100px" height="16px" sx={{ marginTop: '24px' }} />
          <Stack
            sx={{ marginTop: '16px' }}
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
          >
            <Skeleton
              width="40px"
              height="40px"
              variant="circular"
              sx={{ marginRight: '16px' }}
            />
            <Box>
              <Skeleton width="80px" height="22px" />
              <Skeleton width="150px" height="14px" sx={{ marginTop: '4px' }} />
            </Box>
          </Stack>
        </Box>
        <Box height="16px" />
      </Box>
    </Card>
  );
};

export default TradeSkeleton;
