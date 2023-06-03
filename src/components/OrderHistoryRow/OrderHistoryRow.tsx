import React from 'react';
import { Avatar, Badge, Skeleton, TableCell, TableRow } from '@mui/material';
import { Box } from '@mui/system';
import moment from 'moment';
import TransactionID from '../TransactionID/TransactionID';
import { OrderType, ChainType, OrderStatusType, TokenType } from '../../types';
import {
  getOrderFromChain,
  getOrderFromToken,
  getOrderLink,
  getOrderToChain,
  getOrderToToken,
} from '../../utils';
import { ChainTokenBox } from '../ChainTokenBox/ChainTokenBox';
import { AvatarDefault } from '../Avatar/AvatarDefault';
import { OrderHistoryRowChip } from './OrderHistoryRowChip';

type Props = {
  order: OrderType;
  chains: ChainType[];
  onClick?: () => void;
};

const OrderHistoryRow = (props: Props) => {
  const { order, chains, onClick } = props;
  const explorerLink = getOrderLink(order, chains);
  const fromChain = getOrderFromChain(order, chains);
  const fromToken = getOrderFromToken(order, chains);
  const toChain = getOrderToChain(order, chains);
  const toToken = getOrderToToken(order, chains);
  const status: {
    label: string;
    color:
      | 'success'
      | 'default'
      | 'error'
      | 'primary'
      | 'secondary'
      | 'info'
      | 'warning'
      | undefined;
  } =
    order.status === OrderStatusType.COMPLETE
      ? { label: 'Completed', color: 'success' }
      : order.status === OrderStatusType.COMPLETION_FAILURE
      ? { label: 'Failed', color: 'error' }
      : { label: 'In process', color: 'warning' };

  const renderTokenCell = (
    chain: ChainType,
    token: TokenType,
    amount: string
  ) => (
    <ChainTokenBox
      style={{
        padding: 0,
        height: 'auto',
      }}
      avatar={
        <Badge
          overlap="circular"
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          badgeContent={
            chain && chain.label ? (
              <Avatar
                src={chain.icon}
                alt={chain.label}
                sx={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid #fff',
                  background: '#fff',
                }}
              >
                {chain.label}
              </Avatar>
            ) : (
              <AvatarDefault
                width={16}
                height={16}
                sx={{ border: '2px solid #fff' }}
              />
            )
          }
        >
          {token ? (
            <Avatar
              sx={{ width: '32px', height: '32px' }}
              src={token.icon}
              alt={token.symbol || ''}
            >
              {token.symbol || ''}
            </Avatar>
          ) : (
            <AvatarDefault width={32} height={32} />
          )}
        </Badge>
      }
      title={
        <Box
          style={{
            whiteSpace: 'pre-wrap',
            color: '#000',
          }}
          mb={'3px'}
        >
          {amount}
        </Box>
      }
      subheader={
        <span style={{ whiteSpace: 'pre-wrap' }}>
          {amount && token && chain ? (
            `${token.symbol} on ${chain.label}.`
          ) : (
            <Skeleton />
          )}
        </span>
      }
      selected={true}
      compact={true}
    />
  );

  return (
    <TableRow
      className="OrderHistoryRow"
      key={order._id}
      sx={{
        '&:last-child td, &:last-child th': { border: 0 },
        cursor: onClick ? 'pointer' : 'default',
        '& td': {
          padding: '14px 16px',
        },
      }}
      onClick={onClick}
      hover={!!onClick}
    >
      <TableCell
        component="th"
        scope="row"
        sx={{
          '& svg': {
            color: '#F57F21',
          },
        }}
      >
        {order.orderId ? (
          <TransactionID
            value={order.orderId || ''}
            link={explorerLink}
            startLength={6}
            endLength={4}
            valueStyle={{
              color: '#0B0D17',
            }}
          />
        ) : (
          'Pending...'
        )}
      </TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap', color: '#0B0D17' }}>
        {order.date && <>{moment(order.date).format('MM/DD/YYYY, HH:mm')}</>}
      </TableCell>
      <TableCell>
        {fromChain &&
          fromToken &&
          order.amountTokenDeposit &&
          renderTokenCell(fromChain, fromToken, order.amountTokenDeposit)}
      </TableCell>
      <TableCell>
        {toChain &&
          toToken &&
          order.amountTokenOffer &&
          renderTokenCell(toChain, toToken, order.amountTokenOffer)}
      </TableCell>
      <TableCell sx={{ textAlign: 'right' }}>
        <OrderHistoryRowChip
          label={status.label}
          color={status.color}
          size="small"
        />
      </TableCell>
    </TableRow>
  );
};

export default OrderHistoryRow;
