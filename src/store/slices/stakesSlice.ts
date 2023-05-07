import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { StakeType, ErrorMessageType } from '../../types';

export type StakeCreateInputFieldName = 'amount' | 'chainId';

export type StakeWithdrawInputFieldName = 'amount';

export type StakeCreateInput = {
  [key in StakeCreateInputFieldName]: string;
};

export type StakeWithdrawInput = {
  [key in StakeWithdrawInputFieldName]: string;
};

interface StakesState {
  approved: boolean;
  error: ErrorMessageType;
  input: {
    create: StakeCreateInput;
    withdraw: StakeWithdrawInput;
  };
  items: StakeType[];
  loading: boolean;
}

const initialState: StakesState = {
  approved: false,
  error: { type: '', text: '' },
  input: {
    create: {
      amount: '',
      chainId: '',
    },
    withdraw: {
      amount: '',
    },
  },
  items: [],
  loading: true,
};

const stakesSlice = createSlice({
  name: 'stakes',
  initialState,
  reducers: {
    setItems(state, action: PayloadAction<StakeType[]>) {
      state.items = action.payload;
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
    setCreateInput(state, action: PayloadAction<StakeCreateInput>) {
      state.input.create = action.payload;
    },
    setCreateInputValue(
      state,
      action: PayloadAction<{
        name: StakeCreateInputFieldName;
        value: string;
      }>
    ) {
      state.input.create[action.payload.name] = action.payload.value;
    },
    setWithdrawInput(state, action: PayloadAction<StakeWithdrawInput>) {
      state.input.withdraw = action.payload;
    },
    setWithdrawInputValue(
      state,
      action: PayloadAction<{
        name: StakeWithdrawInputFieldName;
        value: string;
      }>
    ) {
      state.input.withdraw[action.payload.name] = action.payload.value;
    },
    setApproved(state, action: PayloadAction<boolean>) {
      state.approved = action.payload;
    },
  },
});

export const selectStakesStore = (state: RootState) => state.stakes;
export const stakesStoreActions = stakesSlice.actions;
export default stakesSlice.reducer;
