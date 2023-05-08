import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import {
  OfferType,
  ErrorMessageType,
  OrderPlacingStatusType,
} from '../../types';

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
  error: ErrorMessageType;
  filter: Tradefilter;
  isOffersVisible: boolean;
  loading: boolean;
  modal: boolean;
  offerId: string;
  offers: OfferType[];
  orderStatus: OrderPlacingStatusType;
  orderTransactionId: string;
  pricesLoading: boolean;
  total: number;
  toTokenPrice: number | null;
}

const initialState: TradeState = {
  error: { type: '', text: '' },
  filter: {
    fromChainId: '',
    fromTokenId: '',
    toChainId: '97',
    toTokenId: '1839',
    amount: '',
  },
  isOffersVisible: false,
  loading: false,
  modal: false,
  offerId: '',
  offers: [],
  orderStatus: OrderPlacingStatusType.UNINITIALIZED,
  orderTransactionId: '',
  pricesLoading: false,
  total: 0,
  toTokenPrice: null,
};

const tradeSlice = createSlice({
  name: 'trade',
  initialState,
  reducers: {
    setOffers(state, action: PayloadAction<OfferType[]>) {
      state.offers = action.payload;
    },
    addOffers(state, action: PayloadAction<OfferType[]>) {
      state.offers = [...state.offers, ...action.payload];
    },
    setOffersTotal(state, action: PayloadAction<number>) {
      state.total = action.payload;
    },

    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<{ type: string; text: string }>) {
      state.error = action.payload;
    },
    clearError(state) {
      state.error = { type: '', text: '' };
    },
    setFilter(state, action: PayloadAction<Tradefilter>) {
      state.filter = action.payload;
    },
    setFilterValue(
      state,
      action: PayloadAction<{
        name: TradeFilterFieldName;
        value: string;
      }>
    ) {
      state.filter[action.payload.name] = action.payload.value;
    },
    clearFilter(state) {
      state.filter = {
        fromChainId: '',
        fromTokenId: '',
        toChainId: '',
        toTokenId: '',
        amount: '',
      };
    },
    setModal(state, action: PayloadAction<boolean>) {
      state.modal = action.payload;
    },
    setToTokenPrice(state, action: PayloadAction<number | null>) {
      state.toTokenPrice = action.payload;
    },
    setPricesLoading(state, action: PayloadAction<boolean>) {
      state.pricesLoading = action.payload;
    },
    setOffersVisible(state, action: PayloadAction<boolean>) {
      state.isOffersVisible = action.payload;
    },
    setOfferId(state, action: PayloadAction<string>) {
      state.offerId = action.payload;
    },
    setOrderTransactionId(state, action: PayloadAction<string>) {
      state.orderTransactionId = action.payload;
    },
    setOrderStatus(state, action: PayloadAction<OrderPlacingStatusType>) {
      state.orderStatus = action.payload;
    },
  },
});

export const selectTradeStore = (state: RootState) => state.trade;
export const tradeStoreActions = tradeSlice.actions;
export default tradeSlice.reducer;
