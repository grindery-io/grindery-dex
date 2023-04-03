import { Chain } from '../types/Chain';
import { Offer } from '../types/Offer';
import { TokenType } from '../types/TokenType';

class OfferModel {
  public _id: string;
  public chainId: string;
  public min: string;
  public max: string;
  public token: string;
  public tokenAddress: string;
  public isActive: boolean;
  public hash?: string;
  public offerId?: string;
  public tokenId?: string;
  public exchangeRate?: string;
  public estimatedTime?: string;
  public exchangeToken?: string;
  public exchangeChainId?: string;
  public userId?: string;
  public amount?: string;
  public image?: string;
  public title?: string;
  public new?: boolean;

  constructor(offer: Offer) {
    this._id = offer._id;
    this.chainId = offer.chainId;
    this.min = offer.min;
    this.max = offer.max;
    this.token = offer.token;
    this.tokenAddress = offer.tokenAddress;
    this.isActive = offer.isActive;
    this.hash = offer.hash;
    this.offerId = offer.offerId;
    this.tokenId = offer.tokenId;
    this.exchangeRate = offer.exchangeRate;
    this.estimatedTime = offer.estimatedTime;
    this.exchangeToken = offer.exchangeToken;
    this.exchangeChainId = offer.exchangeChainId;
    this.userId = offer.userId;
    this.amount = offer.amount;
    this.image = offer.image;
    this.title = offer.title;
    this.new = offer.new;
  }

  getHash(): string {
    return this.hash || '';
  }

  /**
   * @param {boolean} toLocaleString - default is `true`
   */
  getExchangeRate(toLocaleString: boolean = true): string {
    return toLocaleString
      ? (this.exchangeRate || '').toLocaleString()
      : this.exchangeRate || '';
  }

  getChain(chains: Chain[]): Chain | undefined {
    return chains.find((c) => c.value === `eip155:${this.chainId}`);
  }

  getToken(chains: Chain[]): TokenType | undefined {
    return this.getChain(chains)?.tokens?.find(
      (t: TokenType) => t.symbol === this.token
    );
  }

  getExchangeChain(chains: Chain[]): Chain | undefined {
    return chains.find((c) => c.value === `eip155:${this.exchangeChainId}`);
  }

  getExchangeToken(chains: Chain[]): TokenType | undefined {
    return this.getExchangeChain(chains)?.tokens?.find(
      (t: TokenType) => t.symbol === this.exchangeToken
    );
  }

  getOfferLink(chains: Chain[]): string {
    return this.hash
      ? (
          chains.find(
            (c: Chain) => c.value === `eip155:${this.exchangeChainId}`
          )?.transactionExplorerUrl || ''
        ).replace('{hash}', this.hash || '')
      : '';
  }

  getProviderLink(address: string, chains: Chain[]): string {
    return this.hash
      ? (
          chains.find((c: Chain) => c.chainId === this.chainId)
            ?.addressExplorerUrl || ''
        ).replace('{hash}', address)
      : '';
  }

  getAmount(isBuyer: boolean, fromAmount?: string): string | number {
    return isBuyer
      ? fromAmount && this.exchangeRate
        ? parseFloat(fromAmount) / parseFloat(this.exchangeRate)
        : 0
      : `${parseFloat(this.min).toLocaleString()} — ${parseFloat(
          this.max
        ).toLocaleString()}`;
  }
}

export default OfferModel;
