import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { ErrorMessageType } from '../../types';

export type FaucetInputFieldName = 'address' | 'amount' | 'chainId';

export type FaucetInput = {
  [key in FaucetInputFieldName]: string;
};

interface FaucetState {
  error: ErrorMessageType;
  input: FaucetInput;
  loading: boolean;
  transactionId: string;
}

const initialState: FaucetState = {
  error: { type: '', text: '' },
  input: {
    address: '',
    amount: '',
    chainId: '',
  },
  loading: false,
  transactionId: '',
};

const faucetSlice = createSlice({
  name: 'faucet',
  initialState,
  reducers: {
    setInput(state, action: PayloadAction<FaucetInput>) {
      state.input = action.payload;
    },
    setInputValue(
      state,
      action: PayloadAction<{
        name: FaucetInputFieldName;
        value: string;
      }>
    ) {
      state.input[action.payload.name] = action.payload.value;
    },
    setError(state, action: PayloadAction<{ type: string; text: string }>) {
      state.error = action.payload;
    },
    clearError(state) {
      state.error = { type: '', text: '' };
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setTransactionId(state, action: PayloadAction<string>) {
      state.transactionId = action.payload;
    },
    clearInput(state) {
      state.input = {
        address: '',
        amount: '',
        chainId: '',
      };
    },
  },
});

export const selectFaucetStore = (state: RootState) => state.faucet;
export const faucetStoreActions = faucetSlice.actions;
export default faucetSlice.reducer;
