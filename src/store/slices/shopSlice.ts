import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { ErrorMessageType } from '../../types/ErrorMessageType';
import { OfferType } from '../../types/OfferType';

export type ShopFilterFieldName =
  | 'fromChainId'
  | 'fromTokenId'
  | 'toChainId'
  | 'toTokenId';

export type Shopfilter = {
  [key in ShopFilterFieldName]: string;
};

interface ShopState {
  error: ErrorMessageType;
  loading: boolean;
  acceptedOffer: string;
  accepting: boolean;
  approved: boolean;
  modal: boolean;
  fromTokenPrice: string;
  pricesLoading: boolean;
  offers: OfferType[];
  filter: Shopfilter;
}

const initialState: ShopState = {
  error: { type: '', text: '' },
  loading: true,
  acceptedOffer: '',
  accepting: false,
  approved: false,
  modal: false,
  fromTokenPrice: '',
  pricesLoading: false,
  offers: [],
  filter: {
    fromChainId: '5',
    fromTokenId: '1027',
    toChainId: '97',
    toTokenId: '1839',
  },
};

const shopSlice = createSlice({
  name: 'offers',
  initialState,
  reducers: {
    setShopoffers(state, action: PayloadAction<OfferType[]>) {
      state.offers = action.payload;
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
        fromChainId: '',
        fromTokenId: '',
        toChainId: '',
        toTokenId: '',
      };
    },
    setShopModal(state, action: PayloadAction<boolean>) {
      state.modal = action.payload;
    },
    setShopFromTokenPrice(state, action: PayloadAction<string>) {
      state.fromTokenPrice = action.payload;
    },
    setShopPricesLoading(state, action: PayloadAction<boolean>) {
      state.pricesLoading = action.payload;
    },
    setShopAccepting(state, action: PayloadAction<boolean>) {
      state.accepting = action.payload;
    },
    setShopAcceptedOffer(state, action: PayloadAction<string>) {
      state.acceptedOffer = action.payload;
    },
    setShopApproved(state, action: PayloadAction<boolean>) {
      state.approved = action.payload;
    },
  },
});

export const selectShopOffers = (state: RootState) => state.shop.offers;
export const selectShopError = (state: RootState) => state.shop.error;
export const selectShopLoading = (state: RootState) => state.shop.loading;
export const selectShopFilter = (state: RootState) => state.shop.filter;
export const selectShopModal = (state: RootState) => state.shop.modal;
export const selectShopApproved = (state: RootState) => state.shop.approved;
export const selectShopAccepting = (state: RootState) => state.shop.accepting;
export const selectShopAcceptedOffer = (state: RootState) =>
  state.shop.acceptedOffer;
export const selectShopFromTokenPrice = (state: RootState) =>
  state.shop.fromTokenPrice;
export const selectShopPricesLoading = (state: RootState) =>
  state.shop.pricesLoading;

export const {
  setShopoffers,
  setShopLoading,
  setShopError,
  clearShopError,
  setShopFilter,
  setShopFilterValue,
  clearShopFilter,
  setShopModal,
  setShopFromTokenPrice,
  setShopPricesLoading,
  setShopAccepting,
  setShopAcceptedOffer,
  setShopApproved,
} = shopSlice.actions;

export default shopSlice.reducer;
