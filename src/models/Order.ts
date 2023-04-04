import { Chain } from '../types/Chain';
import { OrderType } from '../types/OrderType';
import { TokenType } from '../types/TokenType';

class Order {
  public _id: string;
  public amountTokenDeposit: string;
  public addressTokenDeposit: string;
  public chainIdTokenDeposit: string;
  public amountTokenOffer: string;
  public date?: string;
  public destAddr?: string;
  public isComplete?: boolean;
  public offerId?: string;
  public orderId?: string;
  public userId?: string;
  public hash?: string;

  constructor(order: OrderType) {
    this._id = order._id;
    this.amountTokenDeposit = order.amountTokenDeposit;
    this.addressTokenDeposit = order.addressTokenDeposit;
    this.chainIdTokenDeposit = order.chainIdTokenDeposit;
    this.amountTokenOffer = order.amountTokenOffer;
    this.date = order.date;
    this.destAddr = order.destAddr;
    this.isComplete = order.isComplete;
    this.offerId = order.offerId;
    this.orderId = order.orderId;
    this.userId = order.userId;
    this.hash = order.hash;
  }

  getOrderLink(chains: Chain[]): string {
    return this.hash
      ? (
          chains.find(
            (c: Chain) => c.value === `eip155:${this.chainIdTokenDeposit}`
          )?.transactionExplorerUrl || ''
        ).replace('{hash}', this.hash || '')
      : '';
  }

  getFromChain(chains: Chain[]) {
    return chains.find((c: Chain) => c.chainId === this.chainIdTokenDeposit);
  }

  getFromToken(chains: Chain[]) {
    return this.getFromChain(chains)?.tokens?.find(
      (t: TokenType) => t.address === this.addressTokenDeposit
    );
  }

  getBuyerLink(chains: Chain[]) {
    return (
      this.destAddr &&
      (
        chains.find(
          (c: Chain) => c.value === `eip155:${this.chainIdTokenDeposit}`
        )?.addressExplorerUrl || ''
      ).replace('{hash}', this.destAddr || '')
    );
  }
}

export default Order;
