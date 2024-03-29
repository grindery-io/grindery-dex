export type LiquidityWalletType = {
  _id: string;
  chainId: string;
  tokens: { [key: string]: string };
  walletAddress: string;
  updated?: boolean;
  new?: boolean;
  name?: string;
  trades?: string;
  reputation?: string;
};
