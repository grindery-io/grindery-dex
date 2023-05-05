import { LiquidityWalletType } from './LiquidityWalletType';

export type OfferType = {
  _id: string;
  chainId: string;
  min: string;
  max: string;
  token: string;
  tokenAddress: string;
  isActive: boolean;
  hash: string;
  offerId?: string;
  tokenId?: string;
  exchangeRate: string;
  estimatedTime: string;
  exchangeToken: string;
  exchangeChainId: string;
  userId: string;
  amount?: string;
  image?: string;
  title?: string;
  new?: boolean;
  provider: string;
  status: OfferStatusType;
  liquidityWallet?: LiquidityWalletType;
};

export enum OfferStatusType {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILURE = 'failure',
  ACTIVATION = 'activation',
  ACTIVATION_FAILURE = 'activationFailure',
  DEACTIVATION = 'deactivation',
  DEACTIVATION_FAILURE = 'deactivationFailure',
}
