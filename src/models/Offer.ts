import { Chain } from '../types/Chain';
import { OfferType } from '../types/OfferType';
import { TokenType } from '../types/TokenType';

class Offer {
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
  public provider?: string;

  constructor(offer: OfferType) {
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
    this.provider = offer.provider;
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

  getProviderLink(chains: Chain[]) {
    return this.hash
      ? (
          chains.find((c: Chain) => c.chainId === this.chainId)
            ?.addressExplorerUrl || ''
        ).replace('{hash}', this.provider || '')
      : '';
  }

  getAmount(formatted: boolean = true): string {
    return formatted
      ? parseFloat(parseFloat(this.amount || '0').toFixed(6)).toString()
      : this.amount || '';
  }

  getExchangeAmount(formatted: boolean = true) {
    const exchangeAmount =
      this.amount && this.exchangeRate
        ? parseFloat(this.amount) * parseFloat(this.exchangeRate)
        : 0;

    return formatted
      ? parseFloat(exchangeAmount.toFixed(6)).toString()
      : exchangeAmount
      ? exchangeAmount.toString()
      : '';
  }

  getUSDAmount(price: number | null, formatted: boolean = true) {
    const usdAmount = price
      ? parseFloat(this.getExchangeAmount(false)) * price
      : 0;
    return formatted
      ? parseFloat(usdAmount.toFixed(4)).toString()
      : usdAmount
      ? usdAmount.toString()
      : '';
  }
}

export default Offer;
