import React from 'react';
import { Box, Skeleton, Stack } from '@mui/material';

type Props = {};

const OfferCardSkeleton = (props: Props) => {
  return (
    <Box
      sx={{
        background: '#FFFFFF',
        boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)',
        borderRadius: '18px',
        width: '100%',
        maxWidth: '335px',
        margin: '0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        flexWrap: 'nowrap',
      }}
    >
      <Skeleton
        variant="rectangular"
        height="69px"
        width="100%"
        sx={{ borderTopLeftRadius: '18px', borderTopRightRadius: '18px' }}
      />
      <Box sx={{ padding: '16px' }}>
        <Skeleton width="50px" />
        <Skeleton
          variant="rectangular"
          height="44px"
          width="150px"
          sx={{ marginTop: '8px' }}
        />
        <Skeleton width="50px" sx={{ marginTop: '16px' }} />
        <Stack
          sx={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '8px',
          }}
        >
          <Skeleton variant="rectangular" height="44px" width="100px" />
          <Skeleton variant="rectangular" height="44px" width="100px" />
        </Stack>
        <Skeleton
          variant="rectangular"
          height="44px"
          width="100%"
          sx={{ borderRadius: '8px', marginTop: '16px' }}
        />
      </Box>
    </Box>
  );
};

export default OfferCardSkeleton;
