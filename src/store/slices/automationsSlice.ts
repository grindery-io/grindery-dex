import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { ErrorMessageType } from '../../types';

export type AutomationsInputFieldName = 'bot' | 'chainId';

export type AutomationsInput = {
  [key in AutomationsInputFieldName]: string;
};

interface AutomationsState {
  botAddress: string;
  error: ErrorMessageType;
  input: AutomationsInput;
  loading: boolean;
}

const initialState: AutomationsState = {
  botAddress: '',
  error: { type: '', text: '' },
  input: {
    bot: '',
    chainId: '',
  },
  loading: false,
};

const automationsSlice = createSlice({
  name: 'automations',
  initialState,
  reducers: {
    setBotAddress(state, action: PayloadAction<string>) {
      state.botAddress = action.payload;
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
    setInput(state, action: PayloadAction<AutomationsInput>) {
      state.input = action.payload;
    },
    setInputValue(
      state,
      action: PayloadAction<{
        name: AutomationsInputFieldName;
        value: string;
      }>
    ) {
      state.input[action.payload.name] = action.payload.value;
    },
  },
});

export const selectAutomationsStore = (state: RootState) => state.automations;
export const automationsStoreActions = automationsSlice.actions;
export default automationsSlice.reducer;
