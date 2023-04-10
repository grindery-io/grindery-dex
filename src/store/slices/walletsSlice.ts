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
    setWalletsItems(state, action: PayloadAction<LiquidityWalletType[]>) {
      state.items = action.payload;
    },
    setWalletsLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setWalletsError(
      state,
      action: PayloadAction<{ type: string; text: string }>
    ) {
      state.error = action.payload;
    },
    clearWalletsError(state) {
      state.error = { type: '', text: '' };
    },
    setWalletsCreateInput(state, action: PayloadAction<WalletsCreateInput>) {
      state.input.create = action.payload;
    },
    setWalletsCreateInputValue(
      state,
      action: PayloadAction<{
        name: WalletsCreateInputFieldName;
        value: string;
      }>
    ) {
      state.input.create[action.payload.name] = action.payload.value;
    },
    clearWalletsCreateInput(state) {
      state.input.create = {
        chainId: '',
      };
    },

    setWalletsAddTokensInput(
      state,
      action: PayloadAction<WalletsAddTokensInput>
    ) {
      state.input.add = action.payload;
    },
    setWalletsAddTokensInputValue(
      state,
      action: PayloadAction<{
        name: WalletsAddTokensInputFieldName;
        value: string;
      }>
    ) {
      state.input.add[action.payload.name] = action.payload.value;
    },
    clearWalletsAddTokensInput(state) {
      state.input.add = {
        tokenId: '',
        amount: '',
      };
    },

    setWalletsWithdrawTokensInput(
      state,
      action: PayloadAction<WalletsWithdrawTokensInput>
    ) {
      state.input.withdraw = action.payload;
    },
    setWalletsWithdrawTokensInputValue(
      state,
      action: PayloadAction<{
        name: WalletsWithdrawTokensInputFieldName;
        value: string;
      }>
    ) {
      state.input.withdraw[action.payload.name] = action.payload.value;
    },
    clearWalletsWithdrawTokensInput(state) {
      state.input.withdraw = {
        amount: '',
      };
    },
  },
});

export const selectWalletsItems = (state: RootState) => state.wallets.items;
export const selectWalletsError = (state: RootState) => state.wallets.error;
export const selectWalletsLoading = (state: RootState) => state.wallets.loading;
export const selectWalletsCreateInput = (state: RootState) =>
  state.wallets.input.create;
export const selectWalletsAddTokensInput = (state: RootState) =>
  state.wallets.input.add;
export const selectWalletWithdrawTokensInput = (state: RootState) =>
  state.wallets.input.withdraw;

export const {
  setWalletsItems,
  setWalletsLoading,
  setWalletsError,
  clearWalletsError,
  setWalletsCreateInput,
  setWalletsCreateInputValue,
  clearWalletsCreateInput,
  setWalletsAddTokensInput,
  setWalletsAddTokensInputValue,
  clearWalletsAddTokensInput,
  setWalletsWithdrawTokensInput,
  setWalletsWithdrawTokensInputValue,
  clearWalletsWithdrawTokensInput,
} = walletsSlice.actions;

export default walletsSlice.reducer;
