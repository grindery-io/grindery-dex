export type Offer = {
  _id: string;
  chain: string;
  min: string;
  max: string;
  token: string;
  tokenAddress: string;
  isActive: boolean;
  hash?: string;
  offerId?: string;
  tokenId?: number;
  tokenIcon?: string;
  new?: boolean;
};
