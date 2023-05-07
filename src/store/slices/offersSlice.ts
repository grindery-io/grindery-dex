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
    setItems(state, action: PayloadAction<OfferType[]>) {
      state.items = action.payload;
    },
    addItems(state, action: PayloadAction<OfferType[]>) {
      state.items = [...state.items, ...action.payload];
    },
    updateItem(state, action: PayloadAction<OfferType>) {
      if (
        state.items.find((item: OfferType) => item._id === action.payload._id)
      ) {
        state.items = [
          ...state.items.map((item: OfferType) => {
            if (item._id === action.payload._id) {
              return action.payload;
            } else {
              return item;
            }
          }),
        ];
      } else {
        state.items = [...state.items, action.payload];
      }
    },
    setTotal(state, action: PayloadAction<number>) {
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
    setInput(state, action: PayloadAction<OffersCreateInput>) {
      state.input = action.payload;
    },
    setInputValue(
      state,
      action: PayloadAction<{
        name: OffersCreateInputInputFieldName;
        value: string;
      }>
    ) {
      state.input[action.payload.name] = action.payload.value;
    },
    clearInput(state) {
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
    setActivating(state, action: PayloadAction<string>) {
      state.activating = action.payload;
    },
  },
});

export const selectOffersStore = (state: RootState) => state.offers;
export const offersStoreActions = offersSlice.actions;
export default offersSlice.reducer;
