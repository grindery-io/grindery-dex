import { ChainType, OrderStatusType, OrderType, TokenType } from '../../types';

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
      (t: TokenType) => t.address === order.addressTokenDeposit
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
