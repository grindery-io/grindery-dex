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
  popupClosed: boolean;
  sessionExpired: boolean;
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
  popupClosed: false,
  sessionExpired: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setId(state, action: PayloadAction<string>) {
      state.id = action.payload || '';
    },
    setAddress(state, action: PayloadAction<string>) {
      state.address = action.payload || '';
    },
    setChain(state, action: PayloadAction<string>) {
      state.chain = action.payload || '';
      state.chainId = (action.payload || '').split(':').pop() || '';
    },
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload || '';
    },
    setIsAdmin(state, action: PayloadAction<boolean>) {
      state.isAdmin = action.payload;
    },
    setIsAdminLoading(state, action: PayloadAction<boolean>) {
      state.isAdminLoading = action.payload;
    },
    setChainTokenPrice(state, action: PayloadAction<number | null>) {
      state.chainTokenPrice = action.payload;
    },
    setChainTokenPriceLoading(state, action: PayloadAction<boolean>) {
      state.chainTokenPriceLoading = action.payload;
    },
    setChainTokenBalance(state, action: PayloadAction<string>) {
      state.chainTokenBalance = action.payload;
    },
    setChainTokenBalanceLoading(state, action: PayloadAction<boolean>) {
      state.chainTokenBalanceLoading = action.payload;
    },
    setAdvancedMode(state, action: PayloadAction<boolean>) {
      state.advancedMode = action.payload;
    },
    setAdvancedModeAlert(state, action: PayloadAction<boolean>) {
      state.advancedModeAlert = action.payload;
    },
    setPopupClosed(state, action: PayloadAction<boolean>) {
      state.popupClosed = action.payload;
    },
    setSessionExpired(state, action: PayloadAction<boolean>) {
      state.sessionExpired = action.payload;
    },
  },
});

export const selectUserStore = (state: RootState) => state.user;
export const userStoreActions = userSlice.actions;
export default userSlice.reducer;
