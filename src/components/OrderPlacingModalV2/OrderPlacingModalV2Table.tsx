import React from 'react';
import { Box } from '@mui/system';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { selectUserStore, useAppSelector } from '../../store';
import TransactionID from '../TransactionID/TransactionID';
import { getOrderSummaryRows } from '../../utils';
import { OrderPlacingModalV2Props } from './OrderPlacingModalV2';

const OrderPlacingModalV2Table = (props: OrderPlacingModalV2Props) => {
  const { chains, createdOrder, offer: selectedoffer } = props;

  const { address } = useAppSelector(selectUserStore);

  const offer = createdOrder?.offer || selectedoffer;

  const orderSummaryRows = getOrderSummaryRows(
    chains,
    offer,
    createdOrder,
    address
  );

  return (
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
                padding: '11px 16px',
                color: '#0B0C0E',
                background: '#E3E3E8',
                border: 'none',
                fontWeight: '400',
              },
            },
            '& tbody tr td:first-child': {
              fontWeight: '700',
            },
            '& td': {
              borderBottom: '1px solid #E3E3E8',
              padding: '11px 16px',
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
  );
};

export default OrderPlacingModalV2Table;
