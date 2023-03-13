export type Offer = {
  id: string;
  chain: string;
  min: string;
  max: string;
  token: string;
  tokenAddress: string;
  tokenIcon?: string;
  isActive: boolean;
};
