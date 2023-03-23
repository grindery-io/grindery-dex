export type LiquidityWallet = {
  _id: string;
  chainId: string;
  tokens: { [key: string]: string };
  updated?: boolean;
  new?: boolean;
};
