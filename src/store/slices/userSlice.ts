import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface UserState {
  accessToken: string;
  address: string;
  advancedMode: boolean;
  advancedModeAlert: boolean;
  chain: string;
  chainId: string;
  chainTokenBalance: string;
  chainTokenBalanceLoading: boolean;
  chainTokenPrice: number | null;
  chainTokenPriceLoading: boolean;
  id: string;
  isAdmin: boolean;
  isAdminLoading: boolean;
}

const initialState: UserState = {
  accessToken: '',
  address: '',
  advancedMode: false,
  advancedModeAlert: true,
  chain: '',
  chainId: '',
  chainTokenBalance: '',
  chainTokenBalanceLoading: true,
  chainTokenPrice: null,
  chainTokenPriceLoading: true,
  id: '',
  isAdmin: false,
  isAdminLoading: true,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserId(state, action: PayloadAction<string>) {
      state.id = action.payload || '';
    },
    setUserAddress(state, action: PayloadAction<string>) {
      state.address = action.payload || '';
    },
    setUserChain(state, action: PayloadAction<string>) {
      state.chain = action.payload || '';
      state.chainId = (action.payload || '').split(':').pop() || '';
    },
    setUserAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload || '';
    },
    setUserIsAdmin(state, action: PayloadAction<boolean>) {
      state.isAdmin = action.payload;
    },
    setUserIsAdminLoading(state, action: PayloadAction<boolean>) {
      state.isAdminLoading = action.payload;
    },
    setUserChainTokenPrice(state, action: PayloadAction<number | null>) {
      state.chainTokenPrice = action.payload;
    },
    setUserChainTokenPriceLoading(state, action: PayloadAction<boolean>) {
      state.chainTokenPriceLoading = action.payload;
    },
    setUserChainTokenBalance(state, action: PayloadAction<string>) {
      state.chainTokenBalance = action.payload;
    },
    setUserChainTokenBalanceLoading(state, action: PayloadAction<boolean>) {
      state.chainTokenBalanceLoading = action.payload;
    },
    setUserAdvancedMode(state, action: PayloadAction<boolean>) {
      state.advancedMode = action.payload;
    },
    setUserAdvancedModeAlert(state, action: PayloadAction<boolean>) {
      state.advancedModeAlert = action.payload;
    },
  },
});

export const selectUserId = (state: RootState) => state.user.id;
export const selectUserAddress = (state: RootState) => state.user.address;
export const selectUserChain = (state: RootState) => state.user.chain;
export const selectUserChainId = (state: RootState) => state.user.chainId;
export const selectUserAccessToken = (state: RootState) =>
  state.user.accessToken;
export const selectUserIsAdmin = (state: RootState) => state.user.isAdmin;
export const selectUserIsAdminLoading = (state: RootState) =>
  state.user.isAdminLoading;
export const selectUserChainTokenPrice = (state: RootState) =>
  state.user.chainTokenPrice;
export const selectUserChainTokenPriceLoading = (state: RootState) =>
  state.user.chainTokenPriceLoading;
export const selectUserChainTokenBalance = (state: RootState) =>
  state.user.chainTokenBalance;
export const selectUserChainTokenBalanceLoading = (state: RootState) =>
  state.user.chainTokenBalanceLoading;
export const selectUserAdvancedMode = (state: RootState) =>
  state.user.advancedMode;
export const selectUserAdvancedModeAlert = (state: RootState) =>
  state.user.advancedModeAlert;
export const {
  setUserId,
  setUserAddress,
  setUserChain,
  setUserAccessToken,
  setUserIsAdmin,
  setUserIsAdminLoading,
  setUserChainTokenPrice,
  setUserChainTokenPriceLoading,
  setUserChainTokenBalance,
  setUserChainTokenBalanceLoading,
  setUserAdvancedMode,
  setUserAdvancedModeAlert,
} = userSlice.actions;
export default userSlice.reducer;
