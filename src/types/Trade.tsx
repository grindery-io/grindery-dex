export type Trade = {
  _id: string;
  amountTokenDeposit: string;
  addressTokenDeposit: string;
  chainIdTokenDeposit: string;
  amountTokenOffer: string;
  date?: string;
  destAddr?: string;
  isComplete?: boolean;
  offerId?: string;
  tradeId?: string;
  userId?: string;
};
