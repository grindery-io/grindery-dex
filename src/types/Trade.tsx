export type Trade = {
  _id: string;
  amountGRT: string;
  amountToken: string;
  date?: string;
  destAddr?: string;
  isComplete?: boolean;
  offerId?: string;
  tradeId?: string;
  userId?: string;
};
