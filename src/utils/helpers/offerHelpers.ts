import _ from 'lodash';
import {
  ChainType,
  ErrorMessageType,
  OfferStatusType,
  OfferType,
  TokenType,
} from '../../types';
import { OffersCreateInput } from '../../store';
import { isNumeric } from '../isNumeric';

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
  return _.groupBy(offers, (offer: OfferType) => offer.chainId);
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

export const getOfferStatus = (offer: OfferType): string => {
  switch (offer.status) {
    case OfferStatusType.PENDING:
      return 'Processing';
    case OfferStatusType.SUCCESS:
      return offer.isActive ? 'Active' : 'Inactive';
    case OfferStatusType.FAILURE:
      return offer.isActive ? 'Active' : 'Inactive';
    case OfferStatusType.ACTIVATION:
      return 'Activating';
    case OfferStatusType.ACTIVATION_FAILURE:
      return offer.isActive ? 'Active' : 'Inactive';
    case OfferStatusType.DEACTIVATION:
      return 'Deactivating';
    case OfferStatusType.DEACTIVATION_FAILURE:
      return offer.isActive ? 'Active' : 'Inactive';
  }
};

export const validateOfferCreateAction = (
  input: OffersCreateInput
): ErrorMessageType | true => {
  if (!input.fromChainId || !input.fromTokenId) {
    return {
      type: 'chain',
      text: 'Chain and token are required',
    };
  }
  if (!input.toChainId || !input.toTokenId) {
    return {
      type: 'toChain',
      text: 'Chain and token are required',
    };
  }
  if (!input.exchangeRate) {
    return {
      type: 'exchangeRate',
      text: 'Exchange rate is required',
    };
  }
  if (!isNumeric(input.exchangeRate)) {
    return {
      type: 'exchangeRate',
      text: 'Must be a number',
    };
  }
  if (!input.amountMin) {
    return {
      type: 'amountMin',
      text: 'Min amount is required',
    };
  }
  if (!isNumeric(input.amountMin)) {
    return {
      type: 'amountMin',
      text: 'Must be a number',
    };
  }
  if (!input.amountMax) {
    return {
      type: 'amountMax',
      text: 'Max amount is required',
    };
  }
  if (!isNumeric(input.amountMax)) {
    return {
      type: 'amountMax',
      text: 'Must be a number',
    };
  }
  if (parseFloat(input.amountMax) < parseFloat(input.amountMin)) {
    return {
      type: 'amountMax',
      text: 'Must be greater than min or equal',
    };
  }

  if (!input.estimatedTime) {
    return {
      type: 'estimatedTime',
      text: 'Execution time is required',
    };
  }
  if (!isNumeric(input.estimatedTime)) {
    return {
      type: 'estimatedTime',
      text: 'Must be a number',
    };
  }
  return true;
};

export const getOfferById = (
  offerId: string,
  offers: OfferType[]
): OfferType | null => {
  return offers.find((offer) => offer.offerId === offerId) || null;
};
