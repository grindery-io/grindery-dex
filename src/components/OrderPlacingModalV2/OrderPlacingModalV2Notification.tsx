import React from 'react';
import { Box } from '@mui/system';
import { EmailNotificationForm } from '..';
import { OrderStatusType } from '../../types';
import { OrderPlacingModalV2Props } from './OrderPlacingModalV2';

const OrderPlacingModalV2Notification = (props: OrderPlacingModalV2Props) => {
  const { createdOrder, onEmailSubmit } = props;

  return (
    <Box>
      {createdOrder &&
        createdOrder.status !== OrderStatusType.COMPLETION_FAILURE && (
          <>
            {(!createdOrder ||
              createdOrder.status !== OrderStatusType.COMPLETE) && (
              <Box sx={{ maxWidth: '332px', marginTop: '16px' }}>
                <EmailNotificationForm onSubmit={onEmailSubmit} />
              </Box>
            )}
          </>
        )}
    </Box>
  );
};

export default OrderPlacingModalV2Notification;
