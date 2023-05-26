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
import { getOfferProviderLink } from './offerHelpers';
import { TransactionID } from '../../components';

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
  subtitle: string;
  content: React.ReactNode;
  status: string;
  completed?: { title: string; subtitle: string; content: React.ReactNode };
}[] => {
  const offerChain = getChainById(offer.exchangeChainId, chains);
  const steps = [];

  steps.push({
    title: 'Switch network in MetaMask',
    subtitle: '',
    content: (
      <Typography>
        You need to select {offerChain?.label} network in MetaMask
      </Typography>
    ),
    completed: {
      title: '',
      subtitle: '',
      content: (
        <Typography>{offerChain?.label} network has been selected</Typography>
      ),
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
      subtitle: '',
      content: (
        <Typography>
          You need to approve {exchangeToken?.symbol} tokens in MetaMask
        </Typography>
      ),
      completed: {
        title: '',
        subtitle: '',
        content: (
          <Typography>
            {exchangeToken?.symbol} token approval transaction has been sent
          </Typography>
        ),
      },
      status: OrderPlacingStatusType.WAITING_APPROVAL,
    });
    steps.push({
      title: 'Processing token approval on chain',
      subtitle: '',
      content: (
        <Typography>
          Waiting for {exchangeToken?.symbol} token approval transaction to be
          processed on chain
        </Typography>
      ),
      completed: {
        title: '',
        subtitle: '',
        content: (
          <Typography>
            {exchangeToken?.symbol} token approval transaction has been
            processed on chain
          </Typography>
        ),
      },
      status: OrderPlacingStatusType.PROCESSING_APPROVAL,
    });
  }

  steps.push({
    title: 'Confirm transaction in MetaMask',
    subtitle: '',
    content: <Typography>You need to confirm order in MetaMask</Typography>,
    completed: {
      title: '',
      subtitle: '',
      content: <Typography>Order transaction initiated in MetaMask</Typography>,
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
      title: '',
      subtitle: '',
      content: <Typography>Order was stored on chain</Typography>,
    },
    status: OrderStatusType.PENDING,
  });

  const providerAddress = offer.provider || '';
  const providerLink = getOfferProviderLink(offer, chains);

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
          Merchant (
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
          ) completed transfer
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
        You will receive your token
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
        on BSC Testnet
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
