import { ChainType, StakeType } from '../../types';

export const getStakeChain = (
  stake: StakeType,
  chains: ChainType[]
): ChainType | null => {
  return chains.find((c) => c.chainId === stake.chainId) || null;
};
