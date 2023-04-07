import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { ErrorMessageType } from '../../types/ErrorMessageType';
import { OfferType } from '../../types/OfferType';

export type OffersCreateInputInputFieldName =
  | 'fromChainId'
  | 'fromTokenId'
  | 'toChainId'
  | 'toTokenId'
  | 'exchangeRate'
  | 'min'
  | 'max'
  | 'amount'
  | 'estimatedTime'
  | 'title'
  | 'image';

export type OffersCreateInput = {
  [key in OffersCreateInputInputFieldName]: string;
};

interface OffersState {
  error: ErrorMessageType;
  loading: boolean;
  items: OfferType[];
  input: OffersCreateInput;
}

const initialState: OffersState = {
  error: { type: '', text: '' },
  loading: true,
  items: [],
  input: {
    fromChainId: '',
    fromTokenId: '',
    toChainId: '',
    toTokenId: '',
    exchangeRate: '',
    min: '',
    max: '',
    amount: '',
    estimatedTime: '',
    title: '',
    image: '',
  },
};

const offersSlice = createSlice({
  name: 'offers',
  initialState,
  reducers: {
    setOffersItems(state, action: PayloadAction<OfferType[]>) {
      state.items = action.payload;
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
  },
});

export const selectOffersItems = (state: RootState) => state.offers.items;
export const selectOffersError = (state: RootState) => state.offers.error;
export const selectOffersLoading = (state: RootState) => state.offers.loading;
export const selectoffersCreateInput = (state: RootState) => state.offers.input;

export const {
  setOffersItems,
  setOffersLoading,
  setOffersError,
  clearOffersError,
  setOfferCreateInput,
  setOfferCreateInputValue,
} = offersSlice.actions;

export default offersSlice.reducer;
