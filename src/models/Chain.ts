import { ChainType } from '../types/ChainType';
import { TokenType } from '../types/TokenType';

class Chain {
  public _id: string;
  public value?: string;
  public caipId: string;
  public label: string;
  public icon: string;
  public token?: string;
  public nativeToken?: string;
  public rpc: string[];
  public tokens?: TokenType[];
  public isActive?: boolean;
  public isTestnet?: boolean;
  public isEvm?: boolean;
  public chainId: string;
  public idHex?: string;
  public transactionExplorerUrl?: string;
  public addressExplorerUrl?: string;

  constructor(chain: ChainType) {
    this._id = chain._id;
    this.value = chain.value;
    this.caipId = chain.caipId;
    this.label = chain.label;
    this.icon = chain.icon;
    this.token = chain.token;
    this.nativeToken = chain.nativeToken;
    this.rpc = chain.rpc;
    this.tokens = chain.tokens;
    this.isActive = chain.isActive;
    this.isTestnet = chain.isTestnet;
    this.isEvm = chain.isEvm;
    this.chainId = chain.chainId;
    this.idHex = chain.idHex;
    this.transactionExplorerUrl = chain.transactionExplorerUrl;
    this.addressExplorerUrl = chain.addressExplorerUrl;
  }

  getHexId() {
    return this.idHex || `0x${parseFloat(this.chainId).toString(16)}`;
  }
}

export default Chain;
