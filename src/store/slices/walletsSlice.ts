import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { ErrorMessageType } from '../../types/ErrorMessageType';
import { LiquidityWalletType } from '../../types/LiquidityWalletType';

interface WalletsState {
  error: ErrorMessageType;
  loading: boolean;
  items: LiquidityWalletType[];
}

const initialState: WalletsState = {
  error: { type: '', text: '' },
  loading: true,
  items: [],
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
  },
});

export const selectWalletsItems = (state: RootState) => state.wallets.items;
export const selectWalletsError = (state: RootState) => state.wallets.error;
export const selectWalletsLoading = (state: RootState) => state.wallets.loading;

export const {
  setWalletsItems,
  setWalletsLoading,
  setWalletsError,
  clearWalletsError,
} = walletsSlice.actions;

export default walletsSlice.reducer;
