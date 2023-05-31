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
    (chain) => chain.chainId === '80001' || chain.chainId === '4002'
  );
};

export const getTokensOptionsList = (
  chains: ChainType[]
): { value: string; label: string; chainId?: string; tokenId?: string }[] => {
  let options = [];
  for (var i = 0; i < chains.length; i++) {
    if (chains[i].tokens) {
      for (var t = 0; t < (chains[i].tokens || []).length; t++) {
        options.push({
          value: `${chains[i]?.tokens?.[t]?.symbol}:${chains[i].chainId}`,
          label: `${chains[i]?.tokens?.[t]?.symbol} on ${chains[i].label}`,
          chainId: chains[i].chainId,
          tokenId: chains[i]?.tokens?.[t]?.symbol,
        });
      }
    }
  }
  return options;
};
