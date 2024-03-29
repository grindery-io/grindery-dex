import { TokenType, ChainType } from '../../types';

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

export const getTokenBySymbol = (
  tokenSymbol: string,
  chainId: string,
  chains: ChainType[]
): TokenType | null => {
  return (
    chains
      .find((c: ChainType) => c.chainId === chainId)
      ?.tokens?.find((t: TokenType) => t.symbol === tokenSymbol) || null
  );
};

export const sortTokens = (tokens: TokenType[]) => {
  return tokens.sort((a, b) => {
    return a.order - b.order;
  });
};
