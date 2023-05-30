import React from 'react';
import { Box } from '@mui/system';
import { Button, Typography } from '@mui/material';
import { OrderPlacingModalV2Props } from './OrderPlacingModalV2';

const OrderPlacingModalV2Error = (props: OrderPlacingModalV2Props) => {
  const { errorMessage, onClose } = props;

  return (
    <>
      <Typography variant="h1" sx={{ margin: '0 0 16px' }}>
        Order Processing Error
      </Typography>
      <Typography sx={{ margin: '0 0 16px' }}>{errorMessage.text}</Typography>
      <Box
        sx={{
          margin: '16px 0',
          '& .MuiButton-root': {
            color: 'white',
            borderColor: 'black',
            padding: '6px 12px',
            fontSize: '14px',
            background: 'black',
            '&:hover': {
              borderColor: 'black',
              background: 'black',
              color: 'white',
            },
            '& .MuiTouchRipple-root': {
              marginRight: '0',
            },
          },
        }}
      >
        <Button
          size="small"
          onClick={() => {
            onClose();
          }}
        >
          Close and try again
        </Button>
      </Box>
    </>
  );
};

export default OrderPlacingModalV2Error;
