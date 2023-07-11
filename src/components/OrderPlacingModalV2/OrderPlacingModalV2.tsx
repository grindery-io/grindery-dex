import React from 'react';
import { Box } from '@mui/system';
import {
  Dialog,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
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
import OrderPlacingModalV2Error from './OrderPlacingModalV2Error';
import TransactionID from '../TransactionID/TransactionID';
import { getOrderSummaryRows } from '../../utils';

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
  const {
    open,
    errorMessage,
    onClose,
    chains,
    createdOrder,
    offer: selectedoffer,
  } = props;
  const showModal = open;

  const { advancedMode, advancedModeAlert, address } =
    useAppSelector(selectUserStore);

  const offer = createdOrder?.offer || selectedoffer;

  const topShift = advancedMode && advancedModeAlert ? '125px' : '78px';

  const orderSummaryRows = getOrderSummaryRows(
    chains,
    offer,
    createdOrder,
    address
  );

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

      <Stack
        alignItems="flex-start"
        justifyContent="center"
        gap="105px"
        flexWrap="wrap"
        direction="row"
        sx={{ width: '100%', maxWidth: '1027px', margin: '64px auto 40px' }}
      >
        {errorMessage?.type === 'acceptOffer' && errorMessage?.text ? (
          <Box sx={{ flex: 1 }}>
            <OrderPlacingModalV2Error {...props} />
          </Box>
        ) : (
          <Stack
            alignItems="stretch"
            justifyContent="flex-start"
            gap="32px"
            flexWrap="nowrap"
            direction="column"
            sx={{ flex: 1 }}
          >
            <OrderPlacingModalV2Title {...props} />
            <Box sx={{ height: '1px', background: '#D4D7DD' }} />
            <OrderPlacingModalV2Summary {...props} />
          </Stack>
        )}
        <Box sx={{ flex: 1 }}>
          <OrderPlacingModalV2History {...props} />
        </Box>
      </Stack>
      <Box sx={{ width: '100%', maxWidth: '1027px', margin: '0 auto 64px' }}>
        <TableContainer
          sx={{
            '& table': {
              width: '100%',
              borderCollapse: 'collapse',
              //border: '1px solid #979797',
              background: '#fff',
              borderRadius: '20px',
              overflow: 'hidden',
              '& thead': {
                '& th': {
                  padding: '12px 16px',
                  color: '#fff',
                  background: '#0B0C0E',
                  border: 'none',
                  fontWeight: '400',
                },
              },
              '& tbody tr td:first-child': {
                fontWeight: '700',
              },
              '& td': {
                borderBottom: '1px solid #E3E3E8',
                padding: '12px 16px',
                textAlign: 'left',
                color: '#000000',
                fontWeight: '400',
                fontSize: '14px',
                lineHeight: '125%',
                '& svg': {
                  color: '#F57F21',
                },
              },
            },
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Network</TableCell>
                <TableCell>Address</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderSummaryRows.map((row) => (
                <TableRow key={row.label}>
                  <TableCell>{row.label}</TableCell>
                  <TableCell>{row.chain}</TableCell>
                  <TableCell>
                    {row.address ? (
                      <TransactionID
                        startLength={6}
                        endLength={4}
                        value={row.address}
                        link={row.addressLink || undefined}
                        valueStyle={{
                          color: '#000000',
                          fontWeight: '400',
                          fontSize: '14px',
                          lineHeight: '125%',
                        }}
                      />
                    ) : (
                      'pending...'
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Dialog>
  );
};

export default OrderPlacingModalV2;
