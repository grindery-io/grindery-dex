export type LiquidityWallet = {
  id: string;
  chainId: string;
  tokens: { [key: string]: string };
  updated?: boolean;
  new?: boolean;
};
