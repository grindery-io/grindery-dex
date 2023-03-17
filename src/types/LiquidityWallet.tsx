export type LiquidityWallet = {
  id: string;
  chain: string | number;
  tokens: { [key: string]: string };
  updated?: boolean;
  new?: boolean;
};
