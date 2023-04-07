import { ChainType } from '../../types/ChainType';
import { TokenType } from '../../types/TokenType';

export const getTokenById = (
  tokenId: string,
  chainId: string,
  chains: ChainType[]
): TokenType | null => {
  return (
    chains
      .find((c: ChainType) => c.chainId === chainId)
      ?.tokens?.find((t: TokenType) => t.coinmarketcapId === tokenId) || null
  );
};

export const getTokensByChain = (chain?: ChainType): TokenType[] => {
  return chain ? chain.tokens || [] : [];
};
