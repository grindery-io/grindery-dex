import _ from 'lodash';
import { ChainType } from '../../types/ChainType';
import { OfferType } from '../../types/OfferType';
import { TokenType } from '../../types/TokenType';

export const getOfferIdFromReceipt = (receipt: any): string => {
  return receipt?.logs?.[0]?.topics?.[1] || '';
};

export const getOfferToChain = (
  offer: OfferType,
  chains: ChainType[]
): ChainType | null => {
  return (
    chains.find(
      (chain: ChainType) => chain.chainId === offer.exchangeChainId
    ) || null
  );
};

export const getOfferFromChain = (
  offer: OfferType,
  chains: ChainType[]
): ChainType | null => {
  return (
    chains.find((chain: ChainType) => chain.chainId === offer.chainId) || null
  );
};

export const getOfferFromToken = (
  offer: OfferType,
  chains: ChainType[]
): TokenType | undefined => {
  return getOfferFromChain(offer, chains)?.tokens?.find(
    (t: TokenType) => t.symbol === offer.token
  );
};

export const getOfferToToken = (
  offer: OfferType,
  chains: ChainType[]
): TokenType | undefined => {
  return getOfferToChain(offer, chains)?.tokens?.find(
    (t: TokenType) => t.symbol === offer.exchangeToken
  );
};

export const groupOffersByChainId = (offers: OfferType[]) => {
  return _.groupBy(offers, (offer) => offer.chainId);
};

export const getOfferExchangeRate = (
  offer: OfferType,
  toLocaleString: boolean = true
): string => {
  return toLocaleString
    ? (offer.exchangeRate || '').toLocaleString()
    : offer.exchangeRate || '';
};

export const getOfferLink = (offer: OfferType, chains: ChainType[]): string => {
  return offer.hash
    ? (
        chains.find(
          (c: ChainType) => c.value === `eip155:${offer.exchangeChainId}`
        )?.transactionExplorerUrl || ''
      ).replace('{hash}', offer.hash || '')
    : '';
};

export const getOfferProviderLink = (offer: OfferType, chains: ChainType[]) => {
  return offer.hash
    ? (
        chains.find((c: ChainType) => c.chainId === offer.chainId)
          ?.addressExplorerUrl || ''
      ).replace('{hash}', offer.provider || '')
    : '';
};

export const getOfferAmount = (
  offer: OfferType,
  formatted: boolean = true
): string => {
  return formatted
    ? parseFloat(parseFloat(offer.amount || '0').toFixed(6)).toString()
    : offer.amount || '';
};

export const getOfferExchangeAmount = (
  offer: OfferType,
  formatted: boolean = true
) => {
  const exchangeAmount =
    offer.amount && offer.exchangeRate
      ? parseFloat(offer.amount) * parseFloat(offer.exchangeRate)
      : 0;

  return formatted
    ? parseFloat(exchangeAmount.toFixed(6)).toString()
    : exchangeAmount
    ? exchangeAmount.toString()
    : '';
};

export const getOfferUSDAmount = (
  offer: OfferType,
  price: number | null,
  formatted: boolean = true
) => {
  const usdAmount = price
    ? parseFloat(getOfferExchangeAmount(offer, false)) * price
    : 0;

  return formatted
    ? parseFloat(usdAmount.toFixed(5)).toString()
    : usdAmount
    ? usdAmount.toString()
    : '';
};

export const orderOffersByActiveState = (offers: OfferType[]) => {
  return _.orderBy(offers, ['isActive'], ['desc']);
};
