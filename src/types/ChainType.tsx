import { TokenType } from './TokenType';

export type ChainType = {
  _id: string;
  value?: string;
  caipId: string;
  label: string;
  icon: string;
  token?: string;
  nativeToken?: string;
  rpc: string[];
  tokens?: TokenType[];
  isActive?: boolean;
  isTestnet?: boolean;
  isEvm?: boolean;
  chainId: string;
  idHex?: string;
  transactionExplorerUrl?: string;
  addressExplorerUrl?: string;
};
