import { ChainType } from '../../types/ChainType';

export const getChainIdHex = (chain: ChainType | string) => {
  const chainId = typeof chain === 'string' ? chain : chain.chainId;
  return `0x${parseFloat(chainId).toString(16)}`;
};
