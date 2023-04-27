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
};

const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    setShopOffers(state, action: PayloadAction<OfferType[]>) {
      state.offers = action.payload.filter(
        (o: OfferType) => o.isActive && o.amount
      );
    },
    setShopLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setShopError(state, action: PayloadAction<{ type: string; text: string }>) {
      state.error = action.payload;
    },
    clearShopError(state) {
      state.error = { type: '', text: '' };
    },
    setShopFilter(state, action: PayloadAction<Shopfilter>) {
      state.filter = action.payload;
    },
    setShopFilterValue(
      state,
      action: PayloadAction<{
        name: ShopFilterFieldName;
        value: string;
      }>
    ) {
      state.filter[action.payload.name] = action.payload.value;
    },
    clearShopFilter(state) {
      state.filter = {
        toChainId: '',
        toTokenId: '',
      };
    },
    setShopModal(state, action: PayloadAction<boolean>) {
      state.modal = action.payload;
    },
    setShopOfferId(state, action: PayloadAction<string>) {
      state.offerId = action.payload;
    },
    setShopOrderTransactionId(state, action: PayloadAction<string>) {
      state.orderTransactionId = action.payload;
    },
    setShopOorderStatus(state, action: PayloadAction<OrderPlacingStatusType>) {
      state.orderStatus = action.payload;
    },
  },
});

export const selectShopOffers = (state: RootState) =>
  state.shop.offers.filter(
    (o: OfferType) =>
      o.chainId === state.shop.filter.toChainId &&
      o.exchangeChainId === '5' &&
      o.tokenId === state.shop.filter.toTokenId
  );
export const selectShopError = (state: RootState) => state.shop.error;
export const selectShopLoading = (state: RootState) => state.shop.loading;
export const selectShopFilter = (state: RootState) => state.shop.filter;
export const selectShopModal = (state: RootState) => state.shop.modal;
export const selectShopOfferId = (state: RootState) => state.shop.offerId;
export const selectShopOrderTransactionId = (state: RootState) =>
  state.shop.orderTransactionId;
export const selectShopOrderStatus = (state: RootState) =>
  state.shop.orderStatus;

export const {
  setShopOffers,
  setShopLoading,
  setShopError,
  clearShopError,
  setShopFilter,
  setShopFilterValue,
  clearShopFilter,
  setShopModal,
  setShopOfferId,
  setShopOrderTransactionId,
  setShopOorderStatus,
} = shopSlice.actions;

export default shopSlice.reducer;
