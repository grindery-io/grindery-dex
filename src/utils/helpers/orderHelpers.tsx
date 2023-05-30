import React from 'react';
import {
  ChainType,
  OfferType,
  OrderPlacingStatusType,
  OrderStatusType,
  OrderType,
  TokenType,
} from '../../types';
import { Typography } from '@mui/material';
import { getChainById } from './chainHelpers';
import { getTokenBySymbol } from './tokenHelpers';
import { TransactionID } from '../../components';
import moment from 'moment';
import { getAddressLink, getTransactionLink } from '../address';

export const getOrderIdFromReceipt = (receipt: any): string => {
  return receipt?.logs?.[0]?.topics?.[2] || '';
};

export const getOrderLink = (order: OrderType, chains: ChainType[]): string => {
  return order.hash
    ? (
        chains.find(
          (c: ChainType) => c.value === `eip155:${order.chainIdTokenDeposit}`
        )?.transactionExplorerUrl || ''
      ).replace('{hash}', order.hash || '')
    : '';
};

export const getOrderFromChain = (
  order: OrderType,
  chains: ChainType[]
): ChainType | null => {
  return (
    chains.find((c: ChainType) => c.chainId === order.chainIdTokenDeposit) ||
    null
  );
};

export const getOrderFromToken = (
  order: OrderType,
  chains: ChainType[]
): TokenType | null => {
  return (
    getOrderFromChain(order, chains)?.tokens?.find(
      (t: TokenType) =>
        t.address === order.addressTokenDeposit ||
        (t.address && order.addressTokenDeposit.includes(t.address))
    ) || null
  );
};

export const getOrderToChain = (
  order: OrderType,
  chains: ChainType[]
): ChainType | null => {
  return (
    chains.find((c: ChainType) => c.chainId === order.offer?.chainId || '') ||
    null
  );
};

export const getOrderToToken = (
  order: OrderType,
  chains: ChainType[]
): TokenType | null => {
  return (
    getOrderToChain(order, chains)?.tokens?.find(
      (t: TokenType) => t.symbol === order.offer?.token || ''
    ) || null
  );
};

export const getOrderBuyerLink = (
  order: OrderType,
  chains: ChainType[]
): string => {
  return (
    (order.destAddr &&
      (
        chains.find(
          (c: ChainType) => c.value === `eip155:${order.chainIdTokenDeposit}`
        )?.addressExplorerUrl || ''
      ).replace('{hash}', order.destAddr || '')) ||
    ''
  );
};

export const sortOrdersByDate = (orders: OrderType[]): OrderType[] => {
  return orders.slice().sort((a: any, b: any) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
};

export const getOrderStatus = (order: OrderType): string => {
  switch (order.status) {
    case OrderStatusType.PENDING:
      return 'Waiting transaction confirmation';
    case OrderStatusType.COMPLETION:
      return 'Processing';
    case OrderStatusType.SUCCESS:
      return 'Processing';
    case OrderStatusType.FAILURE:
      return 'Failed';
    case OrderStatusType.COMPLETE:
      return 'Completed';
  }
};

export const getOrderButtonLabel = (
  order: OrderType,
  loading: boolean,
  isUserA: boolean
) => {
  return order.isComplete
    ? 'Completed'
    : loading || order.status !== OrderStatusType.SUCCESS
    ? 'Processing'
    : isUserA
    ? 'Processing'
    : `Send ${parseFloat(order.amountTokenOffer).toFixed(6).toLocaleString()} ${
        order.offer ? order.offer.token : ''
      }`;
};

export const getOrderSteps = (
  offer: OfferType,
  chains: ChainType[],
  order?: OrderType
): {
  title: string;
  status: string;
  completed?: { title: string };
}[] => {
  const offerChain = getChainById(offer.exchangeChainId, chains);
  const steps = [];

  steps.push({
    title: 'Switch network in MetaMask',
    completed: {
      title: '',
    },
    status: OrderPlacingStatusType.WAITING_NETWORK_SWITCH,
  });

  const exchangeToken = getTokenBySymbol(
    offer.exchangeToken,
    offer.exchangeChainId,
    chains
  );

  if (exchangeToken?.address !== '0x0') {
    steps.push({
      title: 'Approve tokens in MetaMask',
      completed: {
        title: '',
      },
      status: OrderPlacingStatusType.WAITING_APPROVAL,
    });
    steps.push({
      title: 'Processing token approval on chain',
      completed: {
        title: '',
      },
      status: OrderPlacingStatusType.PROCESSING_APPROVAL,
    });
  }

  steps.push({
    title: 'Confirm transaction in MetaMask',
    completed: {
      title: '',
    },
    status: OrderPlacingStatusType.WAITING_CONFIRMATION,
  });

  steps.push({
    title: 'Processing order on chain',
    completed: {
      title: '',
    },
    status: OrderStatusType.PENDING,
  });

  steps.push({
    title: 'Wait for merchant to complete transfer',
    completed: {
      title: '',
    },
    status: OrderStatusType.SUCCESS,
  });

  steps.push({
    title: 'Order complete',
    completed: {
      title: `You will receive your tokens on ${offerChain?.label || ''}`,
    },
    status: OrderStatusType.COMPLETE,
  });

  return steps;
};

export const getOrderHistory = (
  chains: ChainType[],
  order?: OrderType,
  offer?: OfferType | null
): {
  title: string;
  subtitle: string;
  content: React.ReactNode;
  status: string;
  completed?: { title: string; subtitle: string; content: React.ReactNode };
}[] => {
  const steps = [];
  const orderChain = order ? getOrderFromChain(order, chains) : null;

  steps.push({
    title: 'Confirm transaction in MetaMask',
    subtitle: '',
    content: <Typography>You need to confirm order in MetaMask</Typography>,
    completed: {
      title: 'Transaction confirmed',
      subtitle: '',
      content: (
        <Typography>
          You confirmed the transaction on {orderChain?.label} in Metamask
        </Typography>
      ),
    },
    status: OrderPlacingStatusType.WAITING_CONFIRMATION,
  });

  steps.push({
    title: 'Processing order on chain',
    subtitle: '',
    content: (
      <Typography>Waiting for the order to be processed on chain</Typography>
    ),
    completed: {
      title: 'Order processed on-chain',
      subtitle: order ? moment(order.date).format('MM/DD/YYYY HH:mm:ss') : '',
      content: (
        <Typography>
          Your transaction was processed successfully on {orderChain?.label}
        </Typography>
      ),
    },
    status: OrderStatusType.PENDING,
  });

  const providerAddress = order?.offer?.provider || offer?.provider || '';
  const providerLink = getAddressLink(
    order?.offer?.provider || offer?.provider || '',
    order?.offer?.chainId || offer?.chainId || '',
    chains
  );

  steps.push({
    title: 'Merchant transfer',
    subtitle: '',
    content: (
      <Typography>
        Wait for merchant (
        <TransactionID
          value={providerAddress}
          link={providerLink}
          containerComponent="span"
          containerStyle={{
            display: 'inline-flex',
            gap: '2px',
          }}
          valueStyle={{
            fontSize: '14px',
            fontWeight: '400',
          }}
          startLength={6}
          endLength={4}
          buttonStyle={{
            padding: '0 1px',
          }}
        />
        ) to complete transfer
      </Typography>
    ),
    completed: {
      title: '',
      subtitle: '',
      content: (
        <Typography>
          The merchant (
          <TransactionID
            value={providerAddress}
            link={providerLink}
            containerComponent="span"
            containerStyle={{
              display: 'inline-flex',
              gap: '2px',
            }}
            valueStyle={{
              fontSize: '14px',
              fontWeight: '400',
            }}
            startLength={6}
            endLength={4}
            buttonStyle={{
              padding: '0 1px',
            }}
          />
          ) sent you tokens on {orderChain?.label || ''}
        </Typography>
      ),
    },
    status: OrderStatusType.SUCCESS,
  });

  const userAddress = order?.destAddr || '';

  steps.push({
    title: 'Order complete',
    subtitle: '',
    content: (
      <Typography>
        You will receive your tokens
        {userAddress ? (
          <>
            {' '}
            in (
            <TransactionID
              value={userAddress}
              containerComponent="span"
              containerStyle={{
                display: 'inline-flex',
                gap: '2px',
              }}
              startLength={6}
              endLength={4}
              buttonStyle={{
                padding: '0 1px',
              }}
            />
            )
          </>
        ) : null}{' '}
        on {orderChain?.label || ''}
      </Typography>
    ),
    completed: {
      title: '',
      subtitle: '',
      content: null,
    },
    status: OrderStatusType.COMPLETE,
  });

  return steps;
};

export const getOrderSummaryRows = (
  chains: ChainType[],
  offer?: OfferType | null,
  order?: OrderType,
  address?: string
): {
  label: string;
  chain: string;
  address: string;
  addressLink: string;
}[] => {
  const exchangeChain = getChainById(offer?.exchangeChainId || '', chains);
  const offerChain = getChainById(offer?.chainId || '', chains);

  return [
    {
      label: 'Buyer Address',
      chain: exchangeChain?.label || '',
      address: order?.destAddr || address || '',
      addressLink: getAddressLink(
        order?.destAddr || address || '',
        order?.chainIdTokenDeposit || offer?.exchangeChainId || '',
        chains
      ),
    },
    {
      label: 'Seller Address',
      chain: offerChain?.label || '',
      address: order?.offer?.provider || offer?.provider || '',
      addressLink: getAddressLink(
        order?.offer?.provider || offer?.provider || '',
        order?.offer?.chainId || offer?.chainId || '',
        chains
      ),
    },
    {
      label: 'Offer ID',
      chain: exchangeChain?.label || '',
      address: order?.offer?.offerId || offer?.offerId || '',
      addressLink: getTransactionLink(
        order?.offer?.hash || offer?.hash || '',
        order?.offer?.exchangeChainId || offer?.exchangeChainId || '',
        chains
      ),
    },
    {
      label: 'Order ID',
      chain: exchangeChain?.label || '',
      address: order?.orderId || '',
      addressLink: getTransactionLink(
        order?.hash || '',
        order?.chainIdTokenDeposit || '',
        chains
      ),
    },
    {
      label: 'Deposit TX',
      chain: exchangeChain?.label || '',
      address: order?.hash || '',
      addressLink: getTransactionLink(
        order?.hash || '',
        order?.offer?.exchangeChainId || offer?.exchangeChainId || '',
        chains
      ),
    },
    {
      label: 'Payment TX',
      chain: offerChain?.label || '',
      address: order?.completionHash || '',
      addressLink: getTransactionLink(
        order?.completionHash || '',
        order?.offer?.chainId || offer?.chainId || '',
        chains
      ),
    },
  ];
};
