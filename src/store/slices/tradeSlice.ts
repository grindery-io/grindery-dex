import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import {
  OfferType,
  ErrorMessageType,
  OrderPlacingStatusType,
} from '../../types';

export type TradeFilterFieldName = 'toChainId' | 'toTokenId' | 'amount';

export type Tradefilter = {
  [key in TradeFilterFieldName]: string;
};

interface TradeState {
  error: ErrorMessageType;
  filter: Tradefilter;
  isOffersVisible: boolean;
  loading: boolean;
  offers: OfferType[];
  orderStatus: OrderPlacingStatusType;
  orderTransactionId: string;
  pricesLoading: boolean;
  toTokenPrice: number | null;
}

const initialState: TradeState = {
  error: { type: '', text: '' },
  filter: {
    toChainId: '97',
    toTokenId: '1839',
    amount: '',
  },
  isOffersVisible: false,
  loading: false,
  offers: [],
  orderStatus: OrderPlacingStatusType.UNINITIALIZED,
  orderTransactionId: '',
  pricesLoading: false,
  toTokenPrice: null,
};

const tradeSlice = createSlice({
  name: 'trade',
  initialState,
  reducers: {
    setTradeOffers(state, action: PayloadAction<OfferType[]>) {
      state.offers = action.payload.filter((o: OfferType) => o.isActive);
    },
    setTradeLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setTradeError(
      state,
      action: PayloadAction<{ type: string; text: string }>
    ) {
      state.error = action.payload;
    },
    clearTradeError(state) {
      state.error = { type: '', text: '' };
    },
    setTradeFilter(state, action: PayloadAction<Tradefilter>) {
      state.filter = action.payload;
    },
    setTradeFilterValue(
      state,
      action: PayloadAction<{
        name: TradeFilterFieldName;
        value: string;
      }>
    ) {
      state.filter[action.payload.name] = action.payload.value;
    },
    clearTradeFilter(state) {
      state.filter = {
        toChainId: '',
        toTokenId: '',
        amount: '',
      };
    },
    setTradeToTokenPrice(state, action: PayloadAction<number | null>) {
      state.toTokenPrice = action.payload;
    },
    setTradePricesLoading(state, action: PayloadAction<boolean>) {
      state.pricesLoading = action.payload;
    },
    setTradeOffersVisible(state, action: PayloadAction<boolean>) {
      state.isOffersVisible = action.payload;
    },
    setTradeOrderTransactionId(state, action: PayloadAction<string>) {
      state.orderTransactionId = action.payload;
    },
    setTradeOrderStatus(state, action: PayloadAction<OrderPlacingStatusType>) {
      state.orderStatus = action.payload;
    },
  },
});

export const selectTradeOffers = (state: RootState) => state.trade.offers;
export const selectTradeError = (state: RootState) => state.trade.error;
export const selectTradeLoading = (state: RootState) => state.trade.loading;
export const selectTradeFilter = (state: RootState) => state.trade.filter;
export const selectTradeToTokenPrice = (state: RootState) =>
  state.trade.toTokenPrice;
export const selectTradePricesLoading = (state: RootState) =>
  state.trade.pricesLoading;
export const selectTradeOffersVisible = (state: RootState) =>
  state.trade.isOffersVisible;
export const selectTradeOrderTransactionId = (state: RootState) =>
  state.trade.orderTransactionId;
export const selectTradeOrderStatus = (state: RootState) =>
  state.trade.orderStatus;

export const {
  setTradeOffers,
  setTradeLoading,
  setTradeError,
  clearTradeError,
  setTradeFilter,
  setTradeFilterValue,
  clearTradeFilter,
  setTradeToTokenPrice,
  setTradePricesLoading,
  setTradeOffersVisible,
  setTradeOrderTransactionId,
  setTradeOrderStatus,
} = tradeSlice.actions;

export default tradeSlice.reducer;
