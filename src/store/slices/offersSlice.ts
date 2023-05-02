import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { OfferType, ErrorMessageType } from '../../types';

export type OffersCreateInputInputFieldName =
  | 'fromChainId'
  | 'fromTokenId'
  | 'toChainId'
  | 'toTokenId'
  | 'exchangeRate'
  | 'amountMin'
  | 'amountMax'
  | 'amount'
  | 'estimatedTime'
  | 'title'
  | 'image';

export type OffersCreateInput = {
  [key in OffersCreateInputInputFieldName]: string;
};

interface OffersState {
  activating: string;
  error: ErrorMessageType;
  input: OffersCreateInput;
  items: OfferType[];
  loading: boolean;
  total: number;
}

const initialState: OffersState = {
  activating: '',
  error: { type: '', text: '' },
  input: {
    fromChainId: '',
    fromTokenId: '',
    toChainId: '',
    toTokenId: '',
    exchangeRate: '',
    amountMin: '',
    amountMax: '',
    amount: '',
    estimatedTime: '',
    title: '',
    image: '',
  },
  items: [],
  loading: true,
  total: 0,
};

const offersSlice = createSlice({
  name: 'offers',
  initialState,
  reducers: {
    setOffersItems(state, action: PayloadAction<OfferType[]>) {
      state.items = action.payload;
    },
    addOffersItems(state, action: PayloadAction<OfferType[]>) {
      state.items = [...state.items, ...action.payload];
    },
    setOffersTotal(state, action: PayloadAction<number>) {
      state.total = action.payload;
    },
    setOffersLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setOffersError(
      state,
      action: PayloadAction<{ type: string; text: string }>
    ) {
      state.error = action.payload;
    },
    clearOffersError(state) {
      state.error = { type: '', text: '' };
    },
    setOfferCreateInput(state, action: PayloadAction<OffersCreateInput>) {
      state.input = action.payload;
    },
    setOfferCreateInputValue(
      state,
      action: PayloadAction<{
        name: OffersCreateInputInputFieldName;
        value: string;
      }>
    ) {
      state.input[action.payload.name] = action.payload.value;
    },
    clearOffersCreateInput(state) {
      state.input = {
        ...state.input,
        amountMin: '',
        amountMax: '',
        exchangeRate: '',
        estimatedTime: '',
        amount: '',
        image: '',
        title: '',
      };
    },
    setOffersActivating(state, action: PayloadAction<string>) {
      state.activating = action.payload;
    },
  },
});

export const selectOffersItems = (state: RootState) => state.offers.items;
export const selectOffersError = (state: RootState) => state.offers.error;
export const selectOffersLoading = (state: RootState) => state.offers.loading;
export const selectOffersCreateInput = (state: RootState) => state.offers.input;
export const selectOffersActivating = (state: RootState) =>
  state.offers.activating;
export const selectOffersHasMore = (state: RootState) =>
  Boolean(state.offers.items.length < state.offers.total);

export const {
  setOffersItems,
  setOffersLoading,
  setOffersError,
  clearOffersError,
  setOfferCreateInput,
  setOfferCreateInputValue,
  clearOffersCreateInput,
  setOffersActivating,
  addOffersItems,
  setOffersTotal,
} = offersSlice.actions;

export default offersSlice.reducer;
