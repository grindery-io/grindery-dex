import React from 'react';
import { Box, Skeleton } from '@mui/material';
import { Card } from '../../Card';
import { SelectTokenCardHeader } from '../../SelectTokenButton/SelectTokenButton.style';

type Props = {};

const DexOfferSkeleton = (props: Props) => {
  return (
    <Card
      flex={1}
      style={{
        borderRadius: '12px',
        marginBottom: '12px',
        backgroundColor: '#fff',
      }}
    >
      <Box display={'flex'} flexDirection={'row'}></Box>

      <SelectTokenCardHeader
        style={{ height: 'auto' }}
        avatar={<Skeleton variant="circular" width={40} height={40} />}
        title={
          <Box
            style={{
              whiteSpace: 'pre-wrap',
              color: '#000',
            }}
            mb={'3px'}
          >
            <Skeleton width={60} />
            <Skeleton width={60} />
          </Box>
        }
        subheader={<Skeleton width={120} />}
        selected={true}
        compact={false}
      />
    </Card>
  );
};

export default DexOfferSkeleton;
