import { OfferType } from './OfferType';

export type OrderType = {
  _id: string;
  amountTokenDeposit: string;
  addressTokenDeposit: string;
  chainIdTokenDeposit: string;
  amountTokenOffer: string;
  orderId: string;
  date: string;
  destAddr?: string;
  isComplete?: boolean;
  offerId?: string;
  userId?: string;
  hash?: string;
  offer?: OfferType;
  status: OrderStatusType;
  completionHash?: string;
};

export enum OrderStatusType {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILURE = 'failure',
  COMPLETION = 'completion',
  COMPLETE = 'complete',
}
