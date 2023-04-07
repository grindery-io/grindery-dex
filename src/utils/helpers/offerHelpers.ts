import { ChainType } from '../../types/ChainType';
import { OfferType } from '../../types/OfferType';

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
