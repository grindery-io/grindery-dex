import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { StakeType } from '../../types/StakeType';
import { ErrorMessageType } from '../../types/ErrorMessageType';

export type StakeCreateInputFieldName = 'amount' | 'chainId';

export type StakeAddInputFieldName = 'amount' | 'stakeId';

export type StakeWithdrawInputFieldName = 'amount' | 'stakeId';

export type StakeCreateInput = {
  [key in StakeCreateInputFieldName]: string;
};

export type StakeAddInput = {
  [key in StakeAddInputFieldName]: string;
};

export type StakeWithdrawInput = {
  [key in StakeWithdrawInputFieldName]: string;
};

interface StakesState {
  error: ErrorMessageType;
  loading: boolean;
  items: StakeType[];
  input: {
    create: StakeCreateInput;
    add: StakeAddInput;
    withdraw: StakeWithdrawInput;
  };
  approved: boolean;
}

const initialState: StakesState = {
  error: { type: '', text: '' },
  loading: true,
  items: [],
  input: {
    create: {
      amount: '',
      chainId: '',
    },
    add: {
      amount: '',
      stakeId: '',
    },
    withdraw: {
      amount: '',
      stakeId: '',
    },
  },
  approved: false,
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
    setStakesAddInput(state, action: PayloadAction<StakeAddInput>) {
      state.input.add = action.payload;
    },
    setStakesAddInputValue(
      state,
      action: PayloadAction<{
        name: StakeAddInputFieldName;
        value: string;
      }>
    ) {
      state.input.add[action.payload.name] = action.payload.value;
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
export const selectStakesLoading = (state: RootState) => state.stakes.loading;
export const selectStakesCreateInput = (state: RootState) =>
  state.stakes.input.create;

export const {
  setStakesItems,
  setStakesLoading,
  setStakesError,
  clearStakesError,
  setStakesCreateInput,
  setStakesCreateInputValue,
  setStakesAddInput,
  setStakesAddInputValue,
  setStakesWithdrawInput,
  setStakesWithdrawInputValue,
  setStakesApproved,
} = stakesSlice.actions;

export default stakesSlice.reducer;
