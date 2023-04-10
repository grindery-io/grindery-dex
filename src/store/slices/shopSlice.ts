import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { OfferType, ErrorMessageType } from '../../types';

export type ShopFilterFieldName =
  | 'fromChainId'
  | 'fromTokenId'
  | 'toChainId'
  | 'toTokenId';

export type Shopfilter = {
  [key in ShopFilterFieldName]: string;
};

interface ShopState {
  acceptedOffer: string;
  acceptedOfferTx: string;
  accepting: string;
  approved: boolean;
  error: ErrorMessageType;
  filter: Shopfilter;
  fromTokenPrice: number | null;
  loading: boolean;
  modal: boolean;
  offers: OfferType[];
  pricesLoading: boolean;
}

const initialState: ShopState = {
  acceptedOffer: '',
  acceptedOfferTx: '',
  accepting: '',
  approved: false,
  error: { type: '', text: '' },
  filter: {
    fromChainId: '5',
    fromTokenId: '1027',
    toChainId: '97',
    toTokenId: '1839',
  },
  fromTokenPrice: null,
  loading: true,
  modal: false,
  offers: [],
  pricesLoading: false,
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
        fromChainId: '',
        fromTokenId: '',
        toChainId: '',
        toTokenId: '',
      };
    },
    setShopModal(state, action: PayloadAction<boolean>) {
      state.modal = action.payload;
    },
    setShopFromTokenPrice(state, action: PayloadAction<number | null>) {
      state.fromTokenPrice = action.payload;
    },
    setShopPricesLoading(state, action: PayloadAction<boolean>) {
      state.pricesLoading = action.payload;
    },
    setShopAccepting(state, action: PayloadAction<string>) {
      state.accepting = action.payload;
    },
    setShopAcceptedOffer(state, action: PayloadAction<string>) {
      state.acceptedOffer = action.payload;
    },
    setShopAcceptedOfferTx(state, action: PayloadAction<string>) {
      state.acceptedOfferTx = action.payload;
    },
    setShopApproved(state, action: PayloadAction<boolean>) {
      state.approved = action.payload;
    },
  },
});

export const selectShopOffers = (state: RootState) =>
  state.shop.offers.filter(
    (o: OfferType) =>
      o.chainId === state.shop.filter.toChainId &&
      o.exchangeChainId === state.shop.filter.fromChainId &&
      o.tokenId === state.shop.filter.toTokenId
    // TODO: add fromTokenId filter
  );

export const selectShopError = (state: RootState) => state.shop.error;
export const selectShopLoading = (state: RootState) => state.shop.loading;
export const selectShopFilter = (state: RootState) => state.shop.filter;
export const selectShopModal = (state: RootState) => state.shop.modal;
export const selectShopApproved = (state: RootState) => state.shop.approved;
export const selectShopAccepting = (state: RootState) => state.shop.accepting;
export const selectShopAcceptedOffer = (state: RootState) =>
  state.shop.acceptedOffer;
export const selectShopAcceptedOfferTx = (state: RootState) =>
  state.shop.acceptedOfferTx;
export const selectShopFromTokenPrice = (state: RootState) =>
  state.shop.fromTokenPrice;
export const selectShopPricesLoading = (state: RootState) =>
  state.shop.pricesLoading;

export const {
  setShopOffers,
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
  setShopAcceptedOfferTx,
} = shopSlice.actions;

export default shopSlice.reducer;
