import { ChainType } from '../../types/ChainType';
import { StakeType } from '../../types/StakeType';

export const getStakeChain = (
  stake: StakeType,
  chains: ChainType[]
): ChainType | null => {
  return chains.find((c) => c.chainId === stake.chainId) || null;
};
