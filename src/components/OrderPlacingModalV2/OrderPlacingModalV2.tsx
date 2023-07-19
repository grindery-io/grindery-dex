import React from 'react';
import { Box } from '@mui/system';
import { Dialog, IconButton, Stack } from '@mui/material';
import {
  ChainType,
  ErrorMessageType,
  OfferType,
  OrderPlacingStatusType,
  OrderType,
} from '../../types';
import { selectUserStore, useAppSelector } from '../../store';
import CloseIcon from '@mui/icons-material/Close';
import OrderPlacingModalV2History from './OrderPlacingModalV2History';
import OrderPlacingModalV2Title from './OrderPlacingModalV2Title';
import OrderPlacingModalV2Summary from './OrderPlacingModalV2Summary';
import OrderPlacingModalV2Notification from './OrderPlacingModalV2Notification';
import OrderPlacingModalV2Table from './OrderPlacingModalV2Table';

export type OrderPlacingModalV2Props = {
  open: boolean;
  orderStatus: OrderPlacingStatusType;
  createdOrder?: OrderType;
  chains: ChainType[];
  errorMessage: ErrorMessageType;
  onEmailSubmit: (email: string) => Promise<boolean>;
  onClose: () => void;
  offer?: OfferType | null;
  userAmount?: string;
};

const OrderPlacingModalV2 = (props: OrderPlacingModalV2Props) => {
  const { open, onClose } = props;
  const showModal = open;

  const { advancedMode, advancedModeAlert } = useAppSelector(selectUserStore);

  const topShift = advancedMode && advancedModeAlert ? '125px' : '78px';

  return (
    <Dialog
      fullWidth
      sx={{
        width: '100vw',
        maxWidth: '100vw',
        margin: '0 auto',
        height: `calc(100% - ${topShift})`,
        top: topShift,
        '& .MuiBackdrop-root': {
          height: `calc(100% - ${topShift})`,
          top: topShift,
        },
        '& .MuiDialog-paper': {
          background: '#F1F2F4',
          width: '100vw',
          maxWidth: '100vw',
          margin: 0,
          borderRadius: 0,
          flex: 1,
          height: '100%',
          maxHeight: '100%',
          overflow: 'auto',
          boxShadow: 'none',
          padding: '0 20px',
        },
        '& .MuiDialogContent-root': {
          paddingLeft: '8px',
          paddingRight: '8px',
        },
      }}
      open={showModal}
    >
      <Box sx={{ position: 'absolute', top: '16px', right: '16px' }}>
        <IconButton sx={{ color: '#000' }} onClick={onClose}>
          <CloseIcon sx={{ fontSize: 36 }} />
        </IconButton>
      </Box>
      <OrderPlacingModalV2Title {...props} />
      <Stack
        alignItems="flex-start"
        justifyContent="center"
        gap="40px"
        flexWrap="wrap"
        direction="row"
        sx={{ width: '100%', maxWidth: '1028px', margin: '40px auto 40px' }}
      >
        <Stack
          alignItems="stretch"
          justifyContent="flex-start"
          gap="32px"
          flexWrap="nowrap"
          direction="column"
          sx={{ flex: 1 }}
        >
          <OrderPlacingModalV2Summary {...props} />
          <OrderPlacingModalV2Table {...props} />
        </Stack>

        <Box sx={{ flex: 1 }}>
          <OrderPlacingModalV2History {...props} />
          <OrderPlacingModalV2Notification {...props} />
        </Box>
      </Stack>
    </Dialog>
  );
};

export default OrderPlacingModalV2;
