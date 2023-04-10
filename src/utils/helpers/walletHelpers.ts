import { LiquidityWalletType, ChainType } from '../../types';

export const getWalletChain = (
  wallet: LiquidityWalletType,
  chains: ChainType[]
): ChainType | null => {
  return chains.find((c: ChainType) => c.chainId === wallet.chainId) || null;
};

export const getWalletById = (
  id: string,
  wallets: LiquidityWalletType[]
): LiquidityWalletType | null => {
  return (
    wallets.find((wallet: LiquidityWalletType) => wallet._id === id) || null
  );
};

export const getWalletAddressFromReceipt = (receipt: any): string => {
  return receipt?.events?.[2]?.args?.[0] || '';
};
