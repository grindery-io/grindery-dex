import { TokenType } from './TokenType';

export type Chain = {
  id?: string;
  value: string;
  label: string;
  icon: string;
  token?: string;
  nativeToken?: string;
  rpc: string[];
  tokens?: TokenType[];
};
