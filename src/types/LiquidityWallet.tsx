export type LiquidityWallet = {
  id: string;
  chain: string | number;
  balance: string;
  updated?: boolean;
  new?: boolean;
};
