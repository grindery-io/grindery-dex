import { ChainType } from '../../types';

export const getChainIdHex = (chain: ChainType | string) => {
  const chainId = typeof chain === 'string' ? chain : chain.chainId;
  return `0x${parseFloat(chainId).toString(16)}`;
};

export const getChainById = (chainId: string, chains: ChainType[]) => {
  return chains.find((c: ChainType) => c.chainId === chainId);
};

export const sortChains = (chains: ChainType[]) => {
  return chains.sort((a, b) => {
    return a.order - b.order;
  });
};

export const filterBuyerChains = (chains: ChainType[]): ChainType[] => {
  return chains.filter(
    (chain) =>
      chain.chainId === '5' ||
      chain.chainId === '1' ||
      chain.chainId === '56' ||
      chain.chainId === '97'
  );
};
