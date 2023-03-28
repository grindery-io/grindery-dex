export type Offer = {
  _id: string;
  chainId: string;
  min: string;
  max: string;
  token: string;
  tokenAddress: string;
  isActive: boolean;
  hash?: string;
  offerId?: string;
  tokenId?: string;
  exchangeRate?: string;
  estimatedTime?: string;
  exchangeToken?: string;
  exchangeChainId?: string;
  new?: boolean;
};
