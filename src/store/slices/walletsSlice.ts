import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { LiquidityWalletType, ErrorMessageType } from '../../types';

export type WalletsCreateInputFieldName = 'chainId';
export type WalletsAddTokensInputFieldName = 'tokenId' | 'amount';
export type WalletsWithdrawTokensInputFieldName = 'amount';

export type WalletsCreateInput = {
  [key in WalletsCreateInputFieldName]: string;
};

export type WalletsAddTokensInput = {
  [key in WalletsAddTokensInputFieldName]: string;
};

export type WalletsWithdrawTokensInput = {
  [key in WalletsWithdrawTokensInputFieldName]: string;
};

interface WalletsState {
  error: ErrorMessageType;
  input: {
    add: WalletsAddTokensInput;
    create: WalletsCreateInput;
    withdraw: WalletsWithdrawTokensInput;
  };
  items: LiquidityWalletType[];
  loading: boolean;
}

const initialState: WalletsState = {
  error: { type: '', text: '' },
  input: {
    add: {
      tokenId: '',
      amount: '',
    },
    create: {
      chainId: '',
    },
    withdraw: {
      amount: '',
    },
  },
  items: [],
  loading: true,
};

const walletsSlice = createSlice({
  name: 'wallets',
  initialState,
  reducers: {
    setItems(state, action: PayloadAction<LiquidityWalletType[]>) {
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
    setCreateInput(state, action: PayloadAction<WalletsCreateInput>) {
      state.input.create = action.payload;
    },
    setCreateInputValue(
      state,
      action: PayloadAction<{
        name: WalletsCreateInputFieldName;
        value: string;
      }>
    ) {
      state.input.create[action.payload.name] = action.payload.value;
    },
    clearCreateInput(state) {
      state.input.create = {
        chainId: '',
      };
    },

    setAddTokensInput(state, action: PayloadAction<WalletsAddTokensInput>) {
      state.input.add = action.payload;
    },
    setAddTokensInputValue(
      state,
      action: PayloadAction<{
        name: WalletsAddTokensInputFieldName;
        value: string;
      }>
    ) {
      state.input.add[action.payload.name] = action.payload.value;
    },
    clearAddTokensInput(state) {
      state.input.add = {
        tokenId: '',
        amount: '',
      };
    },

    setWithdrawTokensInput(
      state,
      action: PayloadAction<WalletsWithdrawTokensInput>
    ) {
      state.input.withdraw = action.payload;
    },
    setWithdrawTokensInputValue(
      state,
      action: PayloadAction<{
        name: WalletsWithdrawTokensInputFieldName;
        value: string;
      }>
    ) {
      state.input.withdraw[action.payload.name] = action.payload.value;
    },
    clearWithdrawTokensInput(state) {
      state.input.withdraw = {
        amount: '',
      };
    },
  },
});

export const selectWalletsStore = (state: RootState) => state.wallets;
export const walletsStoreActions = walletsSlice.actions;
export default walletsSlice.reducer;
