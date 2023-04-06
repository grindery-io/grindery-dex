import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { ErrorMessageType } from '../../types/ErrorMessageType';

export type AutomationsInputFieldName = 'bot' | 'chainId';

export type AutomationsInput = {
  [key in AutomationsInputFieldName]: string;
};

interface AutomationsState {
  error: ErrorMessageType;
  loading: boolean;
  botAddress: string;
  input: AutomationsInput;
}

const initialState: AutomationsState = {
  error: { type: '', text: '' },
  loading: false,
  botAddress: '',
  input: {
    bot: '',
    chainId: '',
  },
};

const automationsSlice = createSlice({
  name: 'automations',
  initialState,
  reducers: {
    setAutomationsBotAddress(state, action: PayloadAction<string>) {
      state.botAddress = action.payload;
    },
    setAutomationsLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setAutomationsError(
      state,
      action: PayloadAction<{ type: string; text: string }>
    ) {
      state.error = action.payload;
    },
    clearAutomationsError(state) {
      state.error = { type: '', text: '' };
    },
    setAutomationsInput(state, action: PayloadAction<AutomationsInput>) {
      state.input = action.payload;
    },
    setAutomationsInputValue(
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

export const selectAutomationsError = (state: RootState) =>
  state.automations.error;
export const selectAutomationsLoading = (state: RootState) =>
  state.automations.loading;
export const selectAutomationsInput = (state: RootState) =>
  state.automations.input;
export const selectAutomationsBotAddress = (state: RootState) =>
  state.automations.botAddress;

export const {
  setAutomationsBotAddress,
  setAutomationsLoading,
  setAutomationsError,
  clearAutomationsError,
  setAutomationsInput,
  setAutomationsInputValue,
} = automationsSlice.actions;

export default automationsSlice.reducer;
