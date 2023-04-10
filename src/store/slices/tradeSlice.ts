import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { OfferType, ErrorMessageType } from '../../types';

export type TradeFilterFieldName =
  | 'fromChainId'
  | 'fromTokenId'
  | 'toChainId'
  | 'toTokenId'
  | 'amount';

export type Tradefilter = {
  [key in TradeFilterFieldName]: string;
};

interface TradeState {
  acceptedOfferTx: string;
  approved: boolean;
  error: ErrorMessageType;
  filter: Tradefilter;
  fromTokenBalance: string;
  fromTokenPrice: number | null;
  isOffersVisible: boolean;
  loading: boolean;
  offers: OfferType[];
  pricesLoading: boolean;
  toTokenPrice: number | null;
}

const initialState: TradeState = {
  acceptedOfferTx: '',
  approved: false,
  error: { type: '', text: '' },
  filter: {
    fromChainId: '5',
    fromTokenId: '1027',
    toChainId: '97',
    toTokenId: '1839',
    amount: '',
  },
  fromTokenBalance: '',
  fromTokenPrice: null,
  isOffersVisible: false,
  loading: false,
  offers: [],
  pricesLoading: false,
  toTokenPrice: null,
};

const tradeSlice = createSlice({
  name: 'trade',
  initialState,
  reducers: {
    setTradeOffers(state, action: PayloadAction<OfferType[]>) {
      state.offers = action.payload.filter(
        (o: OfferType) => o.isActive && o.amount
      );
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
        fromChainId: '',
        fromTokenId: '',
        toChainId: '',
        toTokenId: '',
        amount: '',
      };
    },
    setTradeFromTokenPrice(state, action: PayloadAction<number | null>) {
      state.fromTokenPrice = action.payload;
    },
    setTradeToTokenPrice(state, action: PayloadAction<number | null>) {
      state.toTokenPrice = action.payload;
    },
    setTradePricesLoading(state, action: PayloadAction<boolean>) {
      state.pricesLoading = action.payload;
    },
    setTradeAcceptedOfferTx(state, action: PayloadAction<string>) {
      state.acceptedOfferTx = action.payload;
    },
    setTradeApproved(state, action: PayloadAction<boolean>) {
      state.approved = action.payload;
    },
    setTradeFromTokenBalance(state, action: PayloadAction<string>) {
      state.fromTokenBalance = action.payload;
    },
    setTradeOffersVisible(state, action: PayloadAction<boolean>) {
      state.isOffersVisible = action.payload;
    },
  },
});

export const selectTradeOffers = (state: RootState) => state.trade.offers;
export const selectTradeError = (state: RootState) => state.trade.error;
export const selectTradeLoading = (state: RootState) => state.trade.loading;
export const selectTradeFilter = (state: RootState) => state.trade.filter;
export const selectTradeApproved = (state: RootState) => state.trade.approved;
export const selectTradeAcceptedOfferTx = (state: RootState) =>
  state.trade.acceptedOfferTx;
export const selectTradeFromTokenPrice = (state: RootState) =>
  state.trade.fromTokenPrice;
export const selectTradeToTokenPrice = (state: RootState) =>
  state.trade.toTokenPrice;
export const selectTradePricesLoading = (state: RootState) =>
  state.trade.pricesLoading;
export const selectTradeOffersVisible = (state: RootState) =>
  state.trade.isOffersVisible;
export const selectTradeFromTokenBalance = (state: RootState) =>
  state.trade.fromTokenBalance;

export const {
  setTradeOffers,
  setTradeLoading,
  setTradeError,
  clearTradeError,
  setTradeFilter,
  setTradeFilterValue,
  clearTradeFilter,
  setTradeFromTokenPrice,
  setTradeToTokenPrice,
  setTradePricesLoading,
  setTradeApproved,
  setTradeAcceptedOfferTx,
  setTradeFromTokenBalance,
  setTradeOffersVisible,
} = tradeSlice.actions;

export default tradeSlice.reducer;
