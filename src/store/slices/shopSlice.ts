import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import {
  OfferType,
  ErrorMessageType,
  OrderPlacingStatusType,
} from '../../types';

export type ShopFilterFieldName = 'toChainId' | 'toTokenId';

export type Shopfilter = {
  [key in ShopFilterFieldName]: string;
};

interface ShopState {
  error: ErrorMessageType;
  filter: Shopfilter;
  loading: boolean;
  modal: boolean;
  offerId: string;
  offers: OfferType[];
  orderStatus: OrderPlacingStatusType;
  orderTransactionId: string;
  total: number;
}

const initialState: ShopState = {
  error: { type: '', text: '' },
  filter: {
    toChainId: '97',
    toTokenId: '1839',
  },
  loading: true,
  modal: false,
  offerId: '',
  offers: [],
  orderStatus: OrderPlacingStatusType.UNINITIALIZED,
  orderTransactionId: '',
  total: 0,
};

const shopSlice = createSlice({
  name: 'shop',
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
    setFilter(state, action: PayloadAction<Shopfilter>) {
      state.filter = action.payload;
    },
    setFilterValue(
      state,
      action: PayloadAction<{
        name: ShopFilterFieldName;
        value: string;
      }>
    ) {
      state.filter[action.payload.name] = action.payload.value;
    },
    clearFilter(state) {
      state.filter = {
        toChainId: '',
        toTokenId: '',
      };
    },
    setModal(state, action: PayloadAction<boolean>) {
      state.modal = action.payload;
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

export const selectShopStore = (state: RootState) => state.shop;
export const shopStoreActions = shopSlice.actions;
export default shopSlice.reducer;
