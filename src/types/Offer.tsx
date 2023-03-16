export type Offer = {
  _id: string;
  chain: string;
  min: string;
  max: string;
  token: string;
  tokenId?: number;
  tokenAddress: string;
  tokenIcon?: string;
  isActive: boolean;
};
