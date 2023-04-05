import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { ErrorMessageType } from '../../types/ErrorMessageType';

export type FaucetInputFieldName = 'address' | 'amount' | 'chainId';

export type FaucetInput = {
  [key in FaucetInputFieldName]: string;
};

interface FaucetState {
  error: ErrorMessageType;
  loading: boolean;
  transactionId: string;
  input: FaucetInput;
}

const initialState: FaucetState = {
  error: { type: '', text: '' },
  loading: false,
  transactionId: '',
  input: {
    address: '',
    amount: '',
    chainId: '',
  },
};

const faucetSlice = createSlice({
  name: 'faucet',
  initialState,
  reducers: {
    setFaucetInput(state, action: PayloadAction<FaucetInput>) {
      state.input = action.payload;
    },
    setFaucetInputValue(
      state,
      action: PayloadAction<{
        name: FaucetInputFieldName;
        value: string;
      }>
    ) {
      state.input[action.payload.name] = action.payload.value;
    },
    setFaucetError(
      state,
      action: PayloadAction<{ type: string; text: string }>
    ) {
      state.error = action.payload;
    },
    clearFaucetError(state) {
      state.error = { type: '', text: '' };
    },
    setFaucetLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setFaucetTransactionId(state, action: PayloadAction<string>) {
      state.transactionId = action.payload;
    },
    clearFaucetInput(state) {
      state.input = {
        address: '',
        amount: '',
        chainId: '',
      };
    },
  },
});

export const selectFaucetError = (state: RootState) => state.faucet.error;
export const selectFaucetLoading = (state: RootState) => state.faucet.loading;
export const selectFaucetTransactionId = (state: RootState) =>
  state.faucet.transactionId;
export const selectFaucetInput = (state: RootState) => state.faucet.input;
export const {
  setFaucetError,
  clearFaucetError,
  setFaucetLoading,
  setFaucetTransactionId,
  setFaucetInput,
  clearFaucetInput,
  setFaucetInputValue,
} = faucetSlice.actions;

export default faucetSlice.reducer;
