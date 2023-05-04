export type TokenType = {
  _id: string;
  symbol: string;
  address?: string;
  icon?: string;
  chainId?: string;
  coinmarketcapId?: string;
  isActive?: boolean;
  isNative?: boolean;
  order: number;
};
