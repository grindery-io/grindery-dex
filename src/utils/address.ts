import { ChainType } from '../types';

export const formatAddress = (
  address: string,
  start?: number,
  end?: number
): string => {
  return (
    address.substring(0, start || 6) +
    '...' +
    address.substring(address.length - (end || 4))
  );
};

export const getAddressLink = (
  address: string,
  chainId: string,
  chains: ChainType[]
): string => {
  return (
    chains.find((c: ChainType) => c.value === `eip155:${chainId}`)
      ?.addressExplorerUrl || ''
  ).replace('{hash}', address || '');
};

export const getTransactionLink = (
  address: string,
  chainId: string,
  chains: ChainType[]
): string => {
  return (
    chains.find((c: ChainType) => c.value === `eip155:${chainId}`)
      ?.transactionExplorerUrl || ''
  ).replace('{hash}', address || '');
};
