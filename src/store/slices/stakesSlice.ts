import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { StakeType } from '../../types/StakeType';
import { ErrorMessageType } from '../../types/ErrorMessageType';

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
    setStakesItems(state, action: PayloadAction<StakeType[]>) {
      state.items = action.payload;
    },
    setStakesLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setStakesError(
      state,
      action: PayloadAction<{ type: string; text: string }>
    ) {
      state.error = action.payload;
    },
    clearStakesError(state) {
      state.error = { type: '', text: '' };
    },
    setStakesCreateInput(state, action: PayloadAction<StakeCreateInput>) {
      state.input.create = action.payload;
    },
    setStakesCreateInputValue(
      state,
      action: PayloadAction<{
        name: StakeCreateInputFieldName;
        value: string;
      }>
    ) {
      state.input.create[action.payload.name] = action.payload.value;
    },
    setStakesWithdrawInput(state, action: PayloadAction<StakeWithdrawInput>) {
      state.input.withdraw = action.payload;
    },
    setStakesWithdrawInputValue(
      state,
      action: PayloadAction<{
        name: StakeWithdrawInputFieldName;
        value: string;
      }>
    ) {
      state.input.withdraw[action.payload.name] = action.payload.value;
    },
    setStakesApproved(state, action: PayloadAction<boolean>) {
      state.approved = action.payload;
    },
  },
});

export const selectStakesItems = (state: RootState) => state.stakes.items;
export const selectStakesError = (state: RootState) => state.stakes.error;
export const selectStakesLoading = (state: RootState) => state.stakes.loading;
export const selectStakesApproved = (state: RootState) => state.stakes.approved;
export const selectStakesCreateInput = (state: RootState) =>
  state.stakes.input.create;
export const selectStakesWithdrawInput = (state: RootState) =>
  state.stakes.input.withdraw;

export const {
  setStakesItems,
  setStakesLoading,
  setStakesError,
  clearStakesError,
  setStakesCreateInput,
  setStakesCreateInputValue,
  setStakesWithdrawInput,
  setStakesWithdrawInputValue,
  setStakesApproved,
} = stakesSlice.actions;

export default stakesSlice.reducer;
